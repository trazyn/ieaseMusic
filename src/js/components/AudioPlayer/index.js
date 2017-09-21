
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
    shouldComponentUpdate(nextProps) {
        if (nextProps.playing !== this.props.playing) {
            try {
                this.refs.player[nextProps.playing ? 'play' : 'pause']();
            } catch (ex) {
                // Anti warnning
            }
        }

        if (!nextProps.song.data
            && nextProps.song.id === this.props.song.id) {
            return false;
        }

        return true;
    }

    componentDidUpdate() {
        this.ele = document.querySelector('#progress');
    }

    progress(currentTime) {
        var ele = this.ele || document.querySelector('#progress');
        var percent = (currentTime * 1000) / this.props.song.duration;

        ele.firstElementChild.style.width = `${percent * 100}%`;
        ele.firstElementChild.setAttribute('data-time', `${helper.getTime(currentTime * 1000)} / ${helper.getTime(this.props.song.duration)}`);

        this.ele = ele;
    }

    componentDidMount() {
        this.ele = document.querySelector('#progress');
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
                ref="player"
                src={song.src}
                style={{
                    display: 'none'
                }} />
        );
    }
}
