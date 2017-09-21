
import React, { Component } from 'react';
import { Link } from 'react-router';
import { inject, observer } from 'mobx-react';
import injectSheet from 'react-jss';
import clazz from 'classname';

import classes from './classes';
import helper from 'utils/helper';
import Loader from 'ui/Loader';
import FadeImage from 'ui/FadeImage';
import Header from 'components/Header';
import Controller from 'components/Controller';

@inject(stores => ({
    loading: stores.player.loading,
    showLoading: () => stores.player.toggleLoading(true),
    hideLoading: () => setTimeout(() => stores.player.toggleLoading(false), 500),
    meta: stores.player.meta,
    getList: args => {
        var { id, type } = args;
        stores.player.getDetail(type, id);
    },
    list: stores.player.songs,
    recommend: stores.player.recommend,
    artists: stores.player.artists,
    users: stores.player.users,
    getRelated: stores.player.getRelated,
    song: stores.controller.song,
    playing: stores.controller.playing,
    toggle: stores.controller.toggle,
    canitoggle: () => stores.controller.playlist.id === stores.player.meta.id,
    play: (songid) => {
        var { controller, player } = stores;

        controller.setup({
            id: player.meta.id,
            songs: player.songs,
        });
        controller.play(songid);
    },
    canifav: () => {
        var { player, me } = stores;

        // The type must be a playlist
        return player.meta.type === 0
            // And the playlist is not likes
            && me.likes.get('id') !== player.meta.id;
    },
}))
@observer
class Player extends Component {
    async load(props) {
        var { showLoading, hideLoading, getList, getRelated, params, song } = props;

        showLoading();
        await getList(params);
        await getRelated(song);
        hideLoading();
    }

    togglePlayer() {
        var { canitoggle, toggle, play } = this.props;
        canitoggle() ? toggle() : play();
    }

    componentWillMount = () => this.load(this.props);

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.id !== this.props.params.id) {
            this.load(nextProps);
            return;
        }

        if (nextProps.song.id !== this.props.song.id) {
            nextProps.getRelated(nextProps.song);
        }
    }

    componentDidUpdate() {
        var playing = this.refs.list.querySelector(`.${this.props.classes.active}`);

        if (playing) {
            playing.scrollIntoViewIfNeeded();
        }
    }

    renderPeople() {
        var { users, artists } = this.props;
        var content = [];

        if (users.length) {
            content.push(
                <div
                    className={classes.users}
                    key="users">
                    <h3>Listening history</h3>
                    {
                        users.map((e, index) => {
                            return (
                                <Link
                                    className="clearfix tooltip"
                                    data-text={e.name}
                                    key={index}
                                    to={e.link}>
                                    <FadeImage
                                        src={e.avatar}
                                        title={e.name} />
                                </Link>
                            );
                        })
                    }
                </div>
            );
        }

        content.push(
            <div
                className={classes.artists}
                key="artists">
                <h3>Similar artist</h3>
                {
                    artists.slice(0, content.length ? 5 : 10).map(
                        (e, index) => {
                            return (
                                <Link
                                    className="clearfix tooltip"
                                    data-text={e.name}
                                    key={index}
                                    to={e.link}>
                                    <FadeImage
                                        src={e.avatar}
                                        title={e.name} />
                                </Link>
                            );
                        }
                    )
                }
            </div>
        );

        return content;
    }

    renderList() {
        var { classes, playing, canitoggle, song } = this.props;
        var sameToPlaylist = canitoggle();

        return this.props.list.map((e, index) => {
            return (
                <li
                    key={index}
                    className={clazz({
                        [classes.active]: sameToPlaylist && e.id === song.id,
                    })}
                    onClick={ev => {
                        if (sameToPlaylist && e.id === song.id) {
                            this.props.toggle();
                            return;
                        }

                        this.props.play(e.id);
                    }} >

                    {
                        (sameToPlaylist && e.id === song.id)
                            ? <i className={playing ? 'ion-ios-pause' : 'ion-ios-play'} />
                            : <i className="ion-ios-play" />
                    }

                    <span className={classes.index}>
                        {index}
                    </span>

                    <span
                        className={classes.name}
                        title={e.name}>
                        {e.name}
                    </span>

                    <span className={classes.time}>
                        {helper.getTime(e.duration)}
                    </span>
                </li>
            );
        });
    }

    render() {
        var { classes, loading, meta, playing, recommend, canifav } = this.props;
        var heroBackgroundColor = helper.pureColor(meta.pallet);
        var headerIconColor = meta.pallet[0].join();

        return (
            <div className={classes.container}>
                <Loader show={loading} />
                <Header
                    color={`rgb(${headerIconColor})`}
                    showFav={canifav()} />

                <section>
                    <div
                        className={classes.hero}
                        style={{
                            background: heroBackgroundColor,
                        }}>
                        <FadeImage
                            className={classes.cover}
                            src={meta.cover} />

                        <aside className={classes.info}>
                            <div className={classes.text}>
                                <p className={classes.title}>
                                    <span>
                                        {meta.name}
                                    </span>
                                </p>

                                <p className={classes.author}>
                                    <span>
                                        {
                                            meta.author.map((e, index) => {
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

                                <p
                                    className={classes.subtitle}
                                    style={{
                                        marginTop: 20,
                                    }}>
                                    <span>
                                        {meta.company || `${helper.humanNumber(meta.played)} Played`}
                                    </span>
                                </p>

                                <div
                                    className={classes.play}
                                    onClick={() => this.togglePlayer()}>
                                    {
                                        (this.props.canitoggle() && playing)
                                            ? <i className="ion-ios-pause" />
                                            : <i className="ion-ios-play" />
                                    }
                                </div>
                            </div>
                        </aside>

                        <div className={classes.recommend}>
                            {
                                recommend.map((e, index) => {
                                    return (
                                        <Link
                                            className="clearfix"
                                            key={index}
                                            to={e.link}>
                                            <FadeImage src={e.cover} />
                                        </Link>
                                    );
                                })
                            }
                        </div>
                    </div>

                    <div className={classes.body}>
                        <div className={classes.people}>
                            {this.renderPeople()}
                        </div>

                        <div className={classes.list}>
                            <header>
                                <span>
                                    Track
                                </span>

                                <span>
                                    Time
                                </span>
                            </header>
                            <ul ref="list">
                                {this.renderList()}
                            </ul>
                        </div>
                    </div>
                </section>

                <Controller />
            </div>
        );
    }
}

export default injectSheet(classes)(Player);
