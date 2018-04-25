
import React, { Component } from 'react';
import Scroller from 'react-scroll-horizontal';
import { Link } from 'react-router';
import { inject, observer } from 'mobx-react';
import injectSheet from 'react-jss';
import moment from 'moment';
import clazz from 'classname';

import classes from './classes';
import helper from 'utils/helper';
import Loader from 'ui/Loader';
import Header from 'components/Header';
import Controller from 'components/Controller';

@inject(stores => ({
    hasLogin: stores.me.hasLogin,
    playlist: stores.home.list,
    getPlaylist: stores.home.getList,
    loading: stores.home.loading,
    play: (playlist) => {
        var controller = stores.controller;

        controller.setup(playlist);
        controller.play();
    },
    toggle: stores.controller.toggle,
    isPlaying: (id) => {
        var controller = stores.controller;

        // Now is playing
        return controller.playing
            // And the same song
            && controller.playlist.id === id;
    },
    canitoggle: (id) => {
        // Should has same id
        return stores.controller.playlist.id === id;
    },
    naturalScroll: stores.preferences.naturalScroll,
}))
@observer
class Home extends Component {
    componentDidMount() {
        this.props.getPlaylist();
    }

    renderItem(item) {
        var { classes, isPlaying } = this.props;

        return (
            <Link
                to={item.link}
                className={clazz('clearfix', {
                    [classes.playing]: isPlaying(item.id),
                })}>
                <img src={item.cover} />

                <div className={classes.info}>
                    <span className={classes.subtitle}>
                        {
                            item.type === 0
                                ? `${helper.humanNumber(item.played)} PLAYED`
                                : `${item.size} TRACKS`

                        }
                    </span>
                    <div className={classes.title}>
                        {item.name}
                    </div>
                </div>
            </Link>
        );
    }

    renderLiked(item) {
        var { classes, isPlaying } = this.props;

        return (
            <Link
                className={clazz('clearfix', classes.liked, {
                    [classes.playing]: isPlaying(item.id),
                })}
                to={item.link}>
                <div className={classes.cover}>
                    <div>
                        {item.name}
                    </div>
                </div>

                <div className={classes.meta}>
                    <p className={classes.subtitle}>
                        {item.size} Tracks
                    </p>
                    <p
                        className={classes.subtitle}
                        style={{
                            fontSize: 12,
                        }}>
                        {moment(item.updateTime).endOf('day').fromNow()}
                    </p>
                </div>
            </Link>
        );
    }

    renderDaily(item) {
        var { classes, isPlaying, canitoggle, toggle, play } = this.props;
        var playing = isPlaying(item.id);

        return (
            <div
                className={clazz('clearfix', classes.daily, {
                    [classes.playing]: playing,
                })}
                onClick={e => canitoggle(item.id) ? toggle() : play(item)}>
                <div className={classes.mask}>
                    {
                        playing
                            ? <i className="ion-ios-pause" />
                            : <i className="ion-ios-play" />
                    }
                </div>

                <div className={classes.info}>
                    <span className={classes.subtitle}>
                        {item.size} Tracks
                    </span>
                    <div className={classes.title}>
                        {item.name}
                    </div>
                </div>
            </div>
        );
    }

    renderPlaylist() {
        var { classes, playlist, naturalScroll } = this.props;
        var logined = this.props.hasLogin();

        return (
            <Scroller reverseScroll={!naturalScroll}>
                {
                    playlist.map((e, index) => {
                        var isLiked = logined && index === 0;
                        var isDaily = logined && index === 1;

                        if (isDaily && e.songs.length === 0) {
                            return false;
                        }

                        return (
                            <div
                                className={clazz('clearfix', classes.item)}
                                key={index}>
                                {

                                    isLiked
                                        ? this.renderLiked(e)
                                        : (isDaily ? this.renderDaily(e) : this.renderItem(e))
                                }
                            </div>
                        );
                    })
                }
            </Scroller>
        );
    }

    render() {
        var { classes, loading } = this.props;

        return (
            <div
                className={classes.container}
                ref="container">
                <Loader
                    show={loading}
                    text="Please Wait ..." />
                <Header {...{
                    showBack: false,
                }} />

                <main>
                    <div
                        className={classes.logo}
                        dangerouslySetInnerHTML={{__html: `
                            <svg class="${classes.svg}">
                                <defs>
                                    <pattern id="mask" patternUnits="userSpaceOnUse" height="600" width="600">
                                        <image xmlns:xlink="http://www.w3.org/1999/xlink" x="100px" y="-100px" xlink:href="assets/bgcolorful.jpg" width="600" height="600"></image>
                                    </pattern>
                                </defs>
                                <text class="${classes.welcome}" text-anchor="middle" x="50%" y="0" dy="100px">Welcome</text>
                                <text class="${classes.description}" text-anchor="middle" x="50%" y="0" dy="130px">ieaseMusic is Made by 💖</text>
                            </svg>
                        `}} />

                    <div style={{
                        marginTop: 20,
                    }}>
                        {
                            this.renderPlaylist()
                        }
                    </div>
                </main>

                <Controller />
            </div>
        );
    }
}

export default injectSheet(classes)(Home);
