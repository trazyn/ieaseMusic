
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import clazz from 'classname';
import delegate from 'delegate';
import injectSheet from 'react-jss';

import classes from './classes';
import helper from 'utils/helper';
import sine from 'utils/sine';
import ProgressImage from 'ui/ProgressImage';
import Loader from 'ui/Loader';
import Header from 'components/Header';

@inject(stores => ({
    loading: stores.artist.loading,
    profile: stores.artist.profile,
    follow: stores.artist.follow,
    playlist: stores.artist.playlist,
    albums: stores.artist.albums,
    similar: stores.artist.similar,
    getArtist: stores.artist.getArtist,
    playing: stores.controller.playing,
    song: stores.controller.song,
    isPlaying(id) {
        var { controller, artist } = stores;
        var res = controller.playing
            && controller.playlist.id === artist.playlist.id;

        if (res && id) {
            res = res && controller.song.id === id;
        }

        return res;
    },
    async play(songid) {
        var { controller, artist } = stores;
        var sameToPlaying = this.sameToPlaying();

        if (sameToPlaying) {
            if (songid === void 0
                || (controller.playing && controller.song.id === songid)) {
                controller.toggle();
            } else {
                await controller.play(songid);
            }
        } else {
            // Play a new playlist
            controller.setup({
                id: artist.playlist.id,
                link: `/artist/${artist.profile.id}`,
                name: artist.playlist.name,
                songs: artist.playlist.songs,
            });
            await controller.play(songid);
        }
    },
    sameToPlaying() {
        var { controller, artist } = stores;

        return controller.playlist.id === artist.playlist.id;
    },

    highlightAlbum(id) {
        return stores.controller.playlist.id === id;
    },

    hasLogin: stores.me.hasLogin,
}))
@observer
class Artist extends Component {
    componentWillMount = () => this.props.getArtist(this.props.match.params.id);

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            nextProps.getArtist(nextProps.match.params.id);
        }
    }

    componentDidMount() {
        var classes = this.props.classes;
        var navs = Array.from(this.header.querySelectorAll('nav'));

        delegate(this.header, 'nav', 'click', e => {
            navs.map(e => e.classList.remove(classes.selected));
            e.target.classList.add(classes.selected);
        });

        sine.show(this.canvas);
    }

    componentWillUnmount = () => sine.hide();

    componentDidUpdate() {
        var list = this.list;

        if (list) {
            let playing = list.querySelector(`.${this.props.classes.playing}`);

            if (playing) {
                playing.scrollIntoViewIfNeeded();
            }
        }
    }

    state = {
        renderTabContent: this.renderSongs.bind(this),
    };

    renderSongs() {
        var { classes, playlist, sameToPlaying, song, isPlaying } = this.props;

        /* eslint-disable react/jsx-boolean-value */
        return (
            <ul
                className={classes.songs}
                ref={
                    ele => (this.list = ele)
                }
            >
                {
                    playlist.songs.map((e, index) => {
                        return (
                            <li
                                className={clazz({
                                    [classes.playing]: sameToPlaying() && song.id === e.id,
                                })}
                                key={index}
                                onClick={async ev => {
                                    await this.props.play(e.id);
                                }}>
                                {
                                    isPlaying(e.id)
                                        ? <i className="ion-ios-pause" />
                                        : <i className="ion-ios-play" />
                                }

                                <span data-index>
                                    {index}
                                </span>

                                <span
                                    data-name
                                    title={e.name}>
                                    {e.name}
                                </span>

                                <span
                                    data-album
                                    title={e.album.name}>
                                    <Link to={`/player/1/${e.album.id}`}>
                                        {e.album.name}
                                    </Link>
                                </span>

                                <span data-time>
                                    {helper.getTime(e.duration)}
                                </span>
                            </li>
                        );
                    })
                }
            </ul>
        );
        /* eslint-enable */
    }

    renderAlbums() {
        var { classes, albums } = this.props;

        /* eslint-disable react/jsx-boolean-value */
        return (
            <section className={classes.albums}>
                {
                    albums.map((e, index) => {
                        return (
                            <div
                                className={clazz(classes.album, {
                                    [classes.playing]: this.props.highlightAlbum(e.id),
                                })}
                                key={index}>
                                <Link to={e.link}>
                                    <ProgressImage {...{
                                        height: 48,
                                        width: 48,
                                        src: e.cover,
                                    }} />
                                </Link>
                                <div className={classes.info}>
                                    <p
                                        data-name
                                        title={e.name}>
                                        {e.name}
                                    </p>

                                    <p data-time>
                                        {moment(e.publishTime).format('L')}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                }
            </section>
        );
        /* eslint-enable */
    }

    renderArtists() {
        var { classes, hasLogin, similar } = this.props;

        if (!hasLogin()) {
            return <section className={classes.nothing}>Nothing ...</section>;
        }

        return (
            <section className={classes.artists}>
                {
                    similar.map((e, index) => {
                        return (
                            <div
                                className={classes.artist}
                                key={index}>
                                <Link
                                    className="tooltip"
                                    data-text={e.name}
                                    to={e.link}>
                                    <ProgressImage {...{
                                        height: 64,
                                        width: 64,
                                        src: e.avatar,
                                    }} />
                                </Link>
                            </div>
                        );
                    })
                }
            </section>
        );
    }

    render() {
        var { classes, loading, profile, isPlaying, follow } = this.props;
        var size = profile.size || {};
        var followed = profile.followed;

        return (
            <div className={classes.container}>
                <Loader show={loading} />

                <Header
                    {...{
                        transparent: true,
                        showBack: true,
                        showPlaylist: true,
                    }}
                />

                <div className={classes.hero}>
                    <ProgressImage {...{
                        width: window.innerWidth,
                        height: window.innerWidth / (640 / 300),
                        src: profile.background,
                        thumb: (profile.background || '').replace(/\?.*$/, '?param=20y10'),
                    }} />

                    <div className={classes.inner}>
                        <div
                            className={classes.play}
                            onClick={async e => {
                                await this.props.play();
                            }}>
                            {
                                isPlaying()
                                    ? <i className="ion-ios-pause" />
                                    : <i className="ion-ios-play" />
                            }
                        </div>

                        <canvas
                            ref={
                                ele => (this.canvas = ele)
                            }
                        />

                        <p className={classes.name}>
                            {
                                profile.uid
                                    ? (
                                        <Link to={`/user/${profile.uid}`}>
                                            {profile.name}
                                        </Link>
                                    )
                                    : (
                                        <span>
                                            {profile.name}
                                        </span>
                                    )
                            }
                        </p>

                        <div className={classes.meta}>
                            <button
                                className={clazz(classes.follow, {
                                    [classes.followed]: followed,
                                })}
                                onClick={e => follow(followed)}
                            >
                                { followed ? 'Followed' : 'Follow' }
                            </button>

                            <span>
                                {size.song} Tracks
                            </span>

                            <span>
                                {size.mv} MV
                            </span>

                            <span>
                                {size.album} Albums
                            </span>
                        </div>
                    </div>
                </div>

                <div className={classes.body}>
                    <header
                        ref={
                            ele => (this.header = ele)
                        }
                    >
                        <nav
                            onClick={e => this.setState({ renderTabContent: () => this.renderSongs() })}
                            className={classes.selected}>
                            Top 50
                        </nav>

                        <nav onClick={e => this.setState({ renderTabContent: () => this.renderAlbums() })}>
                            All Albums
                        </nav>

                        <nav onClick={e => this.setState({ renderTabContent: () => this.renderArtists() })}>
                            Similar Artist
                        </nav>
                    </header>

                    <div className={classes.content}>
                        {this.state.renderTabContent()}
                    </div>
                </div>
            </div>
        );
    }
}

export default injectSheet(classes)(Artist);
