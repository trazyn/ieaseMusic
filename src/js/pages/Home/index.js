
import React, { Component } from 'react';
import HorizontalScroll from 'react-scroll-horizontal';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import injectSheet from 'react-jss';
import moment from 'moment';
import clazz from 'classname';

import classes from './classes';
import helper from 'utils/helper';
import Loader from 'ui/Loader';
import Header from 'components/Header';
import Controller from 'components/Controller';

@inject('me', 'controller', 'preferences', 'home')
@observer
class Home extends Component {
    isPlaying(id) {
        var controller = this.props.controller;

        // Now is playing
        return controller.playing
            // And the same song
            && controller.playlist.id === id;
    }

    canitoggle(id) {
        // Should has same id
        return this.props.controller.playlist.id === id;
    }

    play(playlist) {
        var controller = this.props.controller;

        controller.setup(playlist);
        controller.play();
    }

    componentDidMount() {
        this.props.home.getList();
    }

    renderItem(item, playing) {
        var { classes } = this.props;

        return (
            <Link
                to={item.link}
                className={clazz('clearfix', {
                    [classes.playing]: playing,
                })}
            >
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

    renderLiked(item, playing) {
        var { classes } = this.props;

        return (
            <Link
                className={clazz('clearfix', classes.liked, {
                    [classes.playing]: playing,
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

    renderDaily(item, playing) {
        var { classes, controller } = this.props;

        return (
            <div
                className={clazz('clearfix', classes.daily, {
                    [classes.playing]: playing,
                })}
                onClick={
                    e => {
                        this.canitoggle(item.id) ? controller.toggle() : this.play(item);
                        this.forceUpdate();
                    }
                }
            >
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
        var { classes, me, preferences, controller, home } = this.props;
        var logined = me.hasLogin();

        return (
            <HorizontalScroll reverseScroll={!preferences.naturalScroll}>
                {
                    () => {
                        return home.list.map(
                            (e, index) => {
                                var isLiked = logined && index === 0;
                                var isDaily = logined && index === 1;
                                var playing = controller.playing
                                    // Has same song
                                    && controller.playlist.id === e.id;

                                if (isDaily && e.songs.length === 0) {
                                    return false;
                                }

                                return (
                                    <div
                                        className={clazz('clearfix', classes.item)}
                                        key={index}
                                    >
                                        {

                                            isLiked
                                                ? this.renderLiked(e, playing)
                                                : (isDaily ? this.renderDaily(e, playing) : this.renderItem(e, playing))
                                        }
                                    </div>
                                );
                            }
                        );
                    }
                }
            </HorizontalScroll>
        );
    }

    render() {
        var { classes, controller, home } = this.props;

        return (
            <div className={classes.container}>
                <Loader
                    show={home.loading}
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

                    <div
                        // Force re-rerender the list
                        key={controller.playing}
                        style={{
                            marginTop: 20,
                        }}
                    >
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
