import React, { Component } from 'react';
import { Link } from 'react-router';
import { inject, observer } from 'mobx-react';
import injectSheet from 'react-jss';
import clazz from 'classname';
import MusicBar from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import classes from './classes';
import ProgressImage from 'ui/ProgressImage';
import { PLAYER_LOOP, PLAYER_SHUFFLE, PLAYER_REPEAT } from 'stores/controller';

@inject(stores => ({
    song: stores.controller.song,
    mode: stores.controller.mode,
    next: stores.controller.next,
    prev: stores.controller.prev,
    toggle: stores.controller.toggle,
    playing: stores.controller.playing,
    toPlay: stores.controller.toPlay,
    changeMode: stores.controller.changeMode,
    isLiked: stores.me.isLiked,
    like: stores.me.like,
    unlike: stores.me.unlike,
    getPlayerLink: () => {
        return stores.controller.playlist.link;
    },
    getPlaylistName: () => {
        return `🎉 ${stores.controller.playlist.name}`;
    },
    hasLogin: stores.me.hasLogin,
    showComments: () => stores.comments.toggle(true),
}))
@observer
class Controller extends Component {
    state = {
        musicProcess: 0
    }
    get MusicBarTime() {
        return Math.floor(this.props.song.duration / 1000);
    }
    formatTimeLabel(time) {
        let length = Math.floor(parseInt(time));
        let minute = Math.floor(time / 60);
        if (minute < 10) {
            minute = '0' + minute;
        }
        let second = length % 60;
        if (second < 10) {
            second = '0' + second;
        }
        return minute + ':' + second;
    }
    handleChange = (value) => {
        this.setState({
            musicProcess: value
        });
        document.querySelector('audio').currentTime = value;
        if (value >= this.MusicBarTime - 1) {
            this.resetMusicProcess();
        }
    }
    handleChangeComplete = () => {
        this.props.toPlay();
    }
    autoIcrement = () => {
        this.autoIcrement = setInterval(() => {
            this.setState({
                musicProcess: this.state.musicProcess + 1
            });
        }, 1000);
    }

    componentWillReceiveProps(props) {
        if (!props.playing && this.state.musicProcess > 0) {
            document.querySelector('audio').currentTime = this.state.musicProcess;
        }
    }
    resetMusicProcess() {
        this.setState({
            musicProcess: 0
        });
    }
    componentDidMount() {
        this.timer = setInterval(() => {
            if (this.props.playing) {
                this.setState({
                    musicProcess: this.state.musicProcess + 1
                });
            }
        }, 1000);
    }
    componentWillUnmount() {
        clearInterval(this.timer);
        this.resetMusicProcess();
    }
    render() {
        var { classes, song, mode, prev, next, toggle, hasLogin, isLiked, like, unlike, playing, getPlayerLink, getPlaylistName, showComments } = this.props;
        var liked = isLiked(song.id);

        if (!song.id) {
            return false;
        }

        return (
            <div className={`${classes.container} dragarea`}>

                <section>
                    {/* Click the cover show the player screen */}

                    <Link
                        className={`${classes.cover} tooltip`}
                        data-text={getPlaylistName()}
                        to={getPlayerLink()}>
                        <ProgressImage {...{
                            height: 50,
                            width: 50,
                            src: song.album.cover,
                        }} />
                    </Link>
                    <div className={classes.centerBar}>
                        <div className={classes.info}>
                            <div className={classes.infoInner}>
                                <p className={classes.title}>
                                    {/* Click the song name show the album screen */}
                                    <Link to={song.album.link}>
                                        {song.name}
                                    </Link>
                                </p>

                                <p className={classes.author}>
                                    {
                                        song.artists.map((e, index) => {
                                            // Show the artist
                                            return (
                                                <Link
                                                    key={index}
                                                    to={e.link}>
                                                    {e.name}
                                                </Link>
                                            );
                                        })
                                    }
                                </p>
                            </div>

                            <div className={classes.timeLabel}>
                                <span>{this.formatTimeLabel(this.state.musicProcess)}/</span>
                                <span>{this.formatTimeLabel(this.MusicBarTime)}</span>
                            </div>
                        </div>
                        {/* <div className={classes.bar} id="progress">
                            <div className={classes.playing} />
                            <div className={classes.buffering} />
                        </div> */}
                        <MusicBar
                            className={classes.processBar}
                            min={0}
                            step={1}
                            tooltip={false}
                            max={this.MusicBarTime}
                            value={this.state.musicProcess}
                            onChangeStart={this.handleChangeStart}
                            onChange={this.handleChange}
                            onChangeComplete={this.handleChangeComplete}
                        />

                    </div>
                    <aside>

                        <div className={classes.action}>
                            {
                                (song.data && song.data.isFlac) && (
                                    <span
                                        className={classes.highquality}
                                        title="High Quality Music">
                                        SQ
                                    </span>
                                )
                            }

                            <svg style={{ width: 16, height: 16 }} onClick={e => showComments()} viewBox="0 0 24 24">
                                <path fill="#000000" d="M12,23A1,1 0 0,1 11,22V19H7A2,2 0 0,1 5,17V7C5,5.89 5.9,5 7,5H21A2,2 0 0,1 23,7V17A2,2 0 0,1 21,19H16.9L13.2,22.71C13,22.9 12.75,23 12.5,23V23H12M13,17V20.08L16.08,17H21V7H7V17H13M3,15H1V3A2,2 0 0,1 3,1H19V3H3V15Z" />
                            </svg>

                            {
                                hasLogin() && (
                                    <i
                                        className={clazz('ion-ios-heart', {
                                            [classes.liked]: liked,
                                        })}
                                        onClick={e => liked ? unlike(song) : like(song)} />
                                )
                            }

                            <svg className="loopMode" style={{ width: 16, height: 16 }} viewBox="0 0 24 24" onClick={this.props.changeMode} >
                                <path className={`${mode === PLAYER_SHUFFLE ? 'show' : ''}`} fill="#000000" d="M17,3L22.25,7.5L17,12L22.25,16.5L17,21V18H14.26L11.44,15.18L13.56,13.06L15.5,15H17V12L17,9H15.5L6.5,18H2V15H5.26L14.26,6H17V3M2,6H6.5L9.32,8.82L7.2,10.94L5.26,9H2V6Z" />
                                <path className={`${mode === PLAYER_REPEAT ? 'show' : ''}`} fill="#000000" d="M18.6,6.62C21.58,6.62 24,9 24,12C24,14.96 21.58,17.37 18.6,17.37C17.15,17.37 15.8,16.81 14.78,15.8L12,13.34L9.17,15.85C8.2,16.82 6.84,17.38 5.4,17.38C2.42,17.38 0,14.96 0,12C0,9.04 2.42,6.62 5.4,6.62C6.84,6.62 8.2,7.18 9.22,8.2L12,10.66L14.83,8.15C15.8,7.18 17.16,6.62 18.6,6.62M7.8,14.39L10.5,12L7.84,9.65C7.16,8.97 6.31,8.62 5.4,8.62C3.53,8.62 2,10.13 2,12C2,13.87 3.53,15.38 5.4,15.38C6.31,15.38 7.16,15.03 7.8,14.39M16.2,9.61L13.5,12L16.16,14.35C16.84,15.03 17.7,15.38 18.6,15.38C20.47,15.38 22,13.87 22,12C22,10.13 20.47,8.62 18.6,8.62C17.69,8.62 16.84,8.97 16.2,9.61Z" />
                                <path className={`${mode === PLAYER_LOOP ? 'show' : ''}`} fill="#000000" d="M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20V23L16,19L12,15M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,13 17.75,13.97 17.3,14.8L18.76,16.26C19.54,15.03 20,13.57 20,12A8,8 0 0,0 12,4Z" />
                            </svg>
                            {/* <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" onClick={this.props.changeMode} >
                                <path fill="#000000" d="M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20V23L16,19L12,15M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,13 17.75,13.97 17.3,14.8L18.76,16.26C19.54,15.03 20,13.57 20,12A8,8 0 0,0 12,4Z" />
                            </svg> */}

                            {/* <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" onClick={this.props.changeMode} >
                                <path fill="#000000" d="M17,3L22.25,7.5L17,12L22.25,16.5L17,21V18H14.26L11.44,15.18L13.56,13.06L15.5,15H17V12L17,9H15.5L6.5,18H2V15H5.26L14.26,6H17V3M2,6H6.5L9.32,8.82L7.2,10.94L5.26,9H2V6Z" />
                            </svg> */}

                            <div className={classes.controls}>
                                <svg style={{ width: 38, height: 38 }} onClick={() => {
                                    prev();
                                    this.resetMusicProcess();
                                }} viewBox="0 0 24 24">
                                    <path fill="#000000" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M8,8H10V16H8M16,8V16L11,12" />
                                </svg>
                                <span
                                    className={classes.toggle}
                                    onClick={toggle}>
                                    {
                                        playing
                                            ? <svg style={{ width: 50, height: 50 }} viewBox="0 0 24 24">
                                                <path fill="#000000" d="M15,16H13V8H15M11,16H9V8H11M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                                            </svg>
                                            : <svg style={{ width: 50, height: 50 }} viewBox="0 0 24 24">
                                                <path fill="#000000" d="M10,16.5V7.5L16,12M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                                            </svg>
                                    }
                                </span>

                                <svg style={{ width: 38, height: 38 }} viewBox="0 0 24 24"
                                    onClick={() => {
                                        next();
                                        this.resetMusicProcess();
                                    }}>
                                    <path fill="#000000" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M8,8L13,12L8,16M14,8H16V16H14" />
                                </svg>
                            </div>
                        </div>
                    </aside>
                </section>
            </div>
        );
    }
}

export default injectSheet(classes)(Controller);
