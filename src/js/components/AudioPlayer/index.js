
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { ipcRenderer } from 'electron';

import helper from 'utils/helper';

@inject(stores => ({
    song: stores.controller.song,
    scrobble: stores.controller.scrobble,
    next: stores.controller.next,
    play: () => stores.controller.play(stores.controller.song.id),
    tryTheNext: stores.controller.tryTheNext,
    playing: stores.controller.playing,
    volume: stores.preferences.volume,
    setVolume: stores.preferences.setVolume,
    autoPlay: stores.preferences.autoPlay,
    lyrics: stores.lyrics.list,
}))
@observer
export default class AudioPlayer extends Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.playing !== this.props.playing) {
            try {
                if (!this.player.src
                    // Avoid init player duplicate play
                    && !this.props.autoPlay) {
                    this.props.play();
                } else {
                    this.player[nextProps.playing ? 'play' : 'pause']();
                }
            } catch (ex) {
                // Anti warnning
            }
        }

        if (this.props.song.id !== nextProps.song.id) {
            // Re-calculations the buffering progress
            this.bufferedDone = false;
        }
    }

    componentDidMount() {
        var player = this.player;
        var { volume, setVolume } = this.props;

        ipcRenderer.on('player-volume-up', () => {
            var volume = player.volume + .1;

            player.volume = volume > 1 ? 1 : volume;
            setVolume(player.volume);
        });

        ipcRenderer.on('player-volume-down', () => {
            var volume = player.volume - .1;

            player.volume = volume < 0 ? 0 : volume;
            setVolume(player.volume);
        });

        player.volume = volume;
    }

    passed = 0;

    progress(currentTime = 0) {
        var duration = this.props.song.duration;
        var ele = this.progress.ele;

        if (!ele || document.contains(ele) === false) {
            this.progress.ele = ele = document.all.progress;
        }

        // Reduce CPU usage, cancel the duplicate compution
        if (currentTime * 1000 - this.passed < 1000) {
            return;
        }

        clearTimeout(this.timer);

        this.timer = setTimeout(
            () => {
                // Some screens progress bar not visible
                if (ele) {
                    let percent = (currentTime * 1000) / duration;

                    this.setPosition(percent, ele);
                    this.buffering(ele.lastElementChild);

                    ele.firstElementChild.setAttribute('data-time', `${helper.getTime(currentTime * 1000)} / ${helper.getTime(duration)}`);
                }
            },
            450
        );

        this.passed = currentTime * 1000;
    }

    scrollerLyrics(currentTime = 0) {
        var lyrics = this.props.lyrics;
        var ele = this.scrollerLyrics.ele;

        if (window.location.hash !== '#/lyrics') {
            return false;
        }

        if (!ele || document.contains(ele) === false) {
            this.scrollerLyrics.ele = ele = document.getElementById('lyrics');
        }

        if (ele) {
            let key = helper.getLyricsKey(currentTime * 1000, lyrics);

            if (key) {
                let playing = ele.querySelectorAll('[playing]');

                Array.from(playing).map(e => e.removeAttribute('playing'));

                playing = ele.querySelector(`[data-times='${key}']`);

                if (!playing.getAttribute('playing')) {
                    playing.setAttribute('playing', true);

                    if (ele.querySelector('section').getAttribute('scrolling')) {
                        // Enhancement #317
                        return;
                    }

                    playing.scrollIntoViewIfNeeded();
                }
            }
        }
    }

    setPosition(percent, ele = document.all.progress) {
        if (!ele) return;

        ele = ele.firstElementChild;
        ele.style.transform = `translate3d(${-100 + percent * 100}%, 0, 0)`;
    }

    buffering(ele) {
        var player = this.player;

        if (
            true
            && !this.bufferedDone
            && ele
            // Player has started
            && player.buffered.length
        ) {
            let buffered = player.buffered.end(player.buffered.length - 1);

            if (buffered >= 100) {
                buffered = 100;
                // Minimum reLayout
                this.bufferedDone = true;
            }
            ele.style.transform = `translate3d(${-100 + buffered}%, 0, 0)`;
        }
    }

    resetProgress() {
        clearTimeout(this.timer);
        this.passed = 0;
        this.setPosition(0);
    }

    render() {
        var { song, tryTheNext } = this.props;

        return (
            <audio
                ref={
                    ele => (this.player = ele)
                }
                style={{
                    display: 'none'
                }}
                src={song.data ? song.data.src : null}
                autoPlay={true}
                onAbort={
                    e => {
                        this.resetProgress();
                    }
                }
                onEnded={
                    e => {
                        this.props.scrobble();
                        this.resetProgress();
                        this.props.next(true);
                    }
                }
                onError={
                    e => {
                        if (!e.target.src.startsWith('http') || song.waiting) return;

                        console.log('Break by %o', e);
                        this.resetProgress();
                        tryTheNext();
                    }
                }
                onSeeked={
                    e => {
                        // Reset passed 0, avoid indicator can not go back
                        this.passed = 0;
                    }
                }
                onTimeUpdate={
                    e => {
                        this.progress(e.target.currentTime);
                        this.scrollerLyrics(e.target.currentTime);
                    }
                }
            />
        );
    }
}
