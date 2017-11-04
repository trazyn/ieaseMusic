
import React, { Component } from 'react';
import { Link } from 'react-router';
import { inject, observer } from 'mobx-react';
import injectSheet from 'react-jss';
import clazz from 'classname';

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
    seek(e) {
        var percent = e.clientX / window.innerWidth;
        var time = this.props.song.duration * percent;

        document.querySelector('audio').currentTime = time / 1000;
    }

    render() {
        var { classes, song, mode, prev, next, toggle, hasLogin, isLiked, like, unlike, playing, getPlayerLink, getPlaylistName, showComments } = this.props;
        var liked = isLiked(song.id);

        if (!song.id) {
            return false;
        }

        return (
            <div className={classes.container}>
                <div
                    className={classes.bar}
                    id="progress"
                    onClick={e => this.seek(e)}>
                    <div className={classes.playing} />
                    <div className={classes.buffering} />
                </div>

                <section>
                    {/* Click the cover show the player screen */}
                    <Link
                        className="tooltip"
                        data-text={getPlaylistName()}
                        to={getPlayerLink()}>
                        <ProgressImage {...{
                            height: 50,
                            width: 50,
                            src: song.album.cover,
                        }} />
                    </Link>

                    <aside>
                        <div className={classes.info}>
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

                            <i
                                className="ion-ios-chatboxes"
                                onClick={e => showComments()} />

                            {
                                hasLogin() && (
                                    <i
                                        className={clazz('ion-ios-heart', {
                                            [classes.liked]: liked,
                                        })}
                                        onClick={e => liked ? unlike(song) : like(song)} />
                                )
                            }

                            <i
                                className={clazz({
                                    'ion-ios-shuffle-strong': mode === PLAYER_SHUFFLE,
                                    'ion-ios-infinite': mode === PLAYER_REPEAT,
                                    'ion-ios-loop-strong': mode === PLAYER_LOOP,
                                })}
                                onClick={this.props.changeMode} />

                            <div className={classes.controls}>
                                <i
                                    className="ion-ios-rewind"
                                    onClick={prev} />

                                <span
                                    className={classes.toggle}
                                    onClick={toggle}>
                                    {
                                        playing
                                            ? <i className="ion-ios-pause" />
                                            : <i
                                                className="ion-ios-play"
                                                style={{
                                                    color: 'inherit'
                                                }} />
                                    }
                                </span>

                                <i
                                    className="ion-ios-fastforward"
                                    onClick={next}
                                    style={{
                                        marginRight: 0,
                                    }} />
                            </div>
                        </div>
                    </aside>
                </section>
            </div>
        );
    }
}

export default injectSheet(classes)(Controller);
