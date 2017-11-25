
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { ipcRenderer } from 'electron';

import helper from 'utils/helper';
import lastfm from 'utils/lastfm';

@inject(stores => ({
    song: stores.controller.song,
    next: stores.controller.next,
    play: () => stores.controller.play(stores.controller.song.id),
    playing: stores.controller.playing,
    volume: stores.preferences.volume,
    setVolume: stores.preferences.setVolume,
    autoPlay: stores.preferences.autoPlay,
}))
@observer
export default class AudioPlayer extends Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.playing !== this.props.playing) {
            try {
                if (!this.refs.player.src
                    // Avoid init player duplicate play
                    && !this.props.autoPlay) {
                    this.props.play();
                } else {
                    this.refs.player[nextProps.playing ? 'play' : 'pause']();
                }
            } catch (ex) {
                // Anti warnning
            }
        }
    }

    componentDidMount() {
        var player = this.refs.player;
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

        // Reduce CPU usage, cancel the duplicate compution
        if (currentTime * 1000 - this.passed < 1000) {
            return;
        }

        clearTimeout(this.timer);

        this.timer = setTimeout(() => {
            var ele = document.querySelector('#progress');

            if (ele) {
                let percent = (currentTime * 1000) / duration;

                ele = ele.firstElementChild;
                ele.style.transform = `translate3d(${-100 + percent * 100}%, 0, 0)`;
                ele.setAttribute('data-time', `${helper.getTime(currentTime * 1000)} / ${helper.getTime(duration)}`);

                this.buffering();
            }
        }, 450);

        this.passed = currentTime * 1000;
    }

    buffering() {
        var ele = document.querySelector('#progress');
        var player = this.refs.player;

        if (ele
            // Player has started
            && player.buffered.length) {
            let buffered = player.buffered.end(player.buffered.length - 1);

            if (buffered >= 100) {
                buffered = 100;
            }

            ele.lastElementChild.style.transform = `translate3d(${-100 + buffered}%, 0, 0)`;
        }
    }

    resetProgress() {
        this.passed = 0;
    }

    render() {
        var song = this.props.song;

        /* eslint-disable */
        return (
            <audio
                autoPlay={true}
                onAbort={e => {
                    this.passed = 0, this.progress();
                }}
                onEnded={e => {
                    lastfm.scrobble(song);
                    this.passed = 0, this.props.next(true);
                }}
                onError={e => console.log(e)}
                onProgress={e => this.buffering(e)}
                onSeeked={e => this.resetProgress()}
                onTimeUpdate={e => this.progress(e.target.currentTime)}
                ref="player"
                src={(song.data || {}).src}
                style={{
                    display: 'none'
                }} />
        );
        /* eslint-enable */
    }
}
