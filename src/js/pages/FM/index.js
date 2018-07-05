
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import clazz from 'classname';
import injectSheet from 'react-jss';

import classes from './classes';
import helper from 'utils/helper';
import Loader from 'ui/Loader';
import FadeImage from 'ui/FadeImage';
import ProgressImage from 'ui/ProgressImage';
import Header from 'components/Header';
import Controller from 'components/Controller';

@inject(stores => ({
    loading: stores.fm.loading,
    getFM: stores.fm.preload,
    songs: stores.fm.playlist.songs,
    song: stores.fm.song,
    next: stores.fm.next,
    play: stores.fm.play,
    like: stores.me.like,
    ban: stores.fm.ban,
    unlike: stores.me.unlike,
    isLiked: stores.me.isLiked,
    comments: stores.comments.total,

    isFMPlaying() {
        var { controller, fm } = stores;
        return controller.playlist.id === fm.playlist.id;
    },

    isPlaying() {
        var { controller, fm } = stores;

        return controller.playing
            && controller.playlist.id === fm.playlist.id;
    },
}))
@observer
class FM extends Component {
    componentWillMount() {
        this.props.getFM();
    }

    seek(e) {
        var width = e.target.getBoundingClientRect().width;
        var padWidth = (window.innerWidth - width) / 2;
        var percent = (e.clientX - padWidth) / width;
        var time = this.props.song.duration * percent;

        document.querySelector('audio').currentTime = time / 1000;
    }

    renderBG() {
        var { classes, songs } = this.props;

        return (
            <div className={classes.covers}>
                {
                    songs.map((e, index) => {
                        return (
                            <div
                                className={classes.cover}
                                key={index}>
                                <FadeImage src={e.album.cover} />
                            </div>
                        );
                    })
                }
            </div>
        );
    }

    render() {
        var { classes, loading, isFMPlaying, isLiked, like, unlike, ban, songs, song, next, comments } = this.props;
        var liked = false;

        if (loading) {
            return (
                <Loader show={true} />
            );
        }

        if (songs.length === 0) {
            return (
                <div>
                    <div className={classes.unavailable}>
                        <p>
                            Oops, Personal FM only available on mainland.
                        </p>

                        <Link to="/">
                            Discover Music
                        </Link>
                    </div>

                    <Controller />
                </div>
            );
        }

        liked = isLiked(song.id);

        return (
            <div className={classes.container}>
                <Header
                    {...{
                        transparent: true,
                        showBack: true,
                    }}
                />

                {this.renderBG()}

                <section className={classes.main}>
                    <article>
                        <ProgressImage {...{
                            height: 290,
                            width: 290,
                            src: song.album.cover,
                        }} />

                        <aside>
                            <p className={classes.title}>
                                <span title={song.name}>
                                    {song.name}
                                </span>
                            </p>
                            <p className={classes.artists}>
                                <span>
                                    {
                                        song.artists.map((e, index) => {
                                            return (
                                                <Link
                                                    key={index}
                                                    to={e.link}>
                                                    {e.name}
                                                </Link>
                                            );
                                        })
                                    }
                                </span>
                            </p>
                            <p className={classes.album}>
                                <span>
                                    <Link
                                        title={song.album.name}
                                        to={song.album.link}>
                                        {song.album.name}
                                    </Link>
                                </span>
                            </p>

                            <p className={classes.comments}>
                                <span>
                                    <Link
                                        title={song.album.name}
                                        to="/comments">
                                        {helper.humanNumber(comments)} Comments
                                    </Link>
                                </span>
                            </p>
                        </aside>
                    </article>

                    <div
                        className={classes.bar}
                        onClick={e => this.seek(e)}>
                        {
                            isFMPlaying() && (
                                <div id="progress">
                                    <div className={classes.playing} />
                                    <div className={classes.buffering} />
                                </div>
                            )
                        }
                    </div>

                    <div className={classes.controls}>
                        <i
                            className={clazz('ion-ios-heart', {
                                [classes.liked]: liked,
                            })}
                            onClick={e => liked ? unlike(song) : like(song)} />

                        <i
                            className="ion-android-arrow-down"
                            onClick={e => ban(song.id)} />

                        <span onClick={e => this.props.play()}>
                            {
                                this.props.isPlaying()
                                    ? <i className="ion-ios-pause" />
                                    : <i className="ion-ios-play" />
                            }
                        </span>

                        <i
                            className="ion-ios-fastforward"
                            onClick={next}
                            style={{
                                marginRight: 0,
                            }} />
                    </div>
                </section>
            </div>
        );
    }
}

export default injectSheet(classes)(FM);
