
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

@inject(stores => ({
    song: stores.controller.song,
    next: stores.controller.next,
    playing: stores.controller.playing,
    progress: stores.controller.onProgress,
}))
@observer
export default class AudioPlayer extends Component {
    shouldComponentUpdate(nextProps) {
        try {
            this.refs.player[nextProps.playing ? 'play' : 'pause']();
        } catch (ex) {
            // Anti warnning
        }

        if (!nextProps.song.data
            && nextProps.song.id === this.props.song.id) {
            return false;
        }

        return true;
    }

    render() {
        var song = this.props.song.data || {};

        return (
            <audio
                autoPlay={true}
                onAbort={e => this.props.progress(0)}
                onEnded={e => this.props.next()}
                onError={e => console.log(e)}
                onTimeUpdate={e => this.props.progress(e.target.currentTime)}
                preload="metadata"
                ref="player"
                src={song.src}
                style={{
                    display: 'none'
                }} />
        );
    }
}
