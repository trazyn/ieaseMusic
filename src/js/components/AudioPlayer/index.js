
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import helper from 'utils/helper';

@inject(stores => ({
    song: stores.controller.song,
    next: stores.controller.next,
    playing: stores.controller.playing,
}))
@observer
export default class AudioPlayer extends Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.playing !== this.props.playing) {
            try {
                this.refs.player[nextProps.playing ? 'play' : 'pause']();
            } catch (ex) {
                // Anti warnning
            }
        }
    }

    progress(currentTime) {
        clearTimeout(this.timer);

        // Reduce CPU usage
        this.timer = setTimeout(() => {
            var ele = document.querySelector('#progress');

            if (ele) {
                let percent = (currentTime * 1000) / this.props.song.duration;

                ele = ele.firstElementChild;
                ele.style.transform = `translate3d(${-100 + percent * 100}%, 0, 0)`;
                ele.setAttribute('data-time', `${helper.getTime(currentTime * 1000)} / ${helper.getTime(this.props.song.duration)}`);
            }
        }, 450);
    }

    buffering() {
        var ele = document.querySelector('#progress');

        if (ele) {
            let player = this.refs.player;
            let buffered = player.buffered.end(player.buffered.length - 1);

            if (buffered >= 100) {
                buffered = 100;
            }

            ele.lastElementChild.style.transform = `translate3d(${-100 + buffered}%, 0, 0)`;
        }
    }

    render() {
        var song = this.props.song.data || {};

        return (
            <audio
                autoPlay={true}
                onAbort={e => this.progress(0)}
                onEnded={e => this.props.next()}
                onError={e => console.log(e)}
                onTimeUpdate={e => this.progress(e.target.currentTime)}
                onProgress={e => this.buffering(e)}
                ref="player"
                src={song.src}
                style={{
                    display: 'none'
                }} />
        );
    }
}
