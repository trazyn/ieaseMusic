
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { remote } from 'electron';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import injectSheet from 'react-jss';
import moment from 'moment';
import clazz from 'classname';

import classes from './classes';
import helper from 'utils/helper';
import Loader from 'ui/Loader';
import FadeImage from 'ui/FadeImage';
import Indicator from 'ui/Indicator';
import ProgressImage from 'ui/ProgressImage';
import Controller from 'components/Controller';

const Status = injectSheet(classes)(
    (props) => {
        var { classes, playing } = props;

        if (!playing) {
            return false;
        }

        return (
            <div
                className={classes.status}
            >
                <Indicator />
            </div>
        );
    }
);

@inject('me', 'controller', 'preferences', 'home')
@observer
class Welcome extends Component {
    canitoggle(id) {
        // Should has same id
        return this.props.controller.playlist.id === id;
    }

    play(playlist) {
        var controller = this.props.controller;

        if (controller.playlist.id === playlist.id) {
            return controller.toggle();
        }

        controller.setup(playlist);
        controller.play();
    }

    doLogout() {
        // Clear cookies
        remote.getCurrentWindow().webContents.session.clearStorageData();
        this.props.me.logout();
    }

    componentDidMount() {
        this.props.home.getList();
    }

    renderPlaylist(list) {
        var { classes, controller } = this.props;

        return list.map(
            (e, index) => {
                return (
                    <Link
                        className={classes.clearfix}
                        key={index}
                        to={e.link}
                    >
                        <Status
                            playing={controller.playlist.id === e.id}
                        />

                        <div className={classes.hovered}>
                            <i className="ion-android-arrow-forward" />
                        </div>

                        <figure className={clazz(classes.item, classes.large)}>
                            <ProgressImage
                                {...{
                                    width: 360,
                                    src: e.background,
                                    className: clazz(classes.background, {
                                        [classes.album]: e.type,
                                    })
                                }}
                            />

                            <figcaption>
                                <ProgressImage
                                    className={classes.cover}
                                    ref={
                                        ele => {
                                            if (!ele || !e.pallet) return;

                                            var dom = ReactDOM.findDOMNode(ele);
                                            setTimeout(
                                                () => (dom.style.boxShadow = `0 0 24px rgb(${e.pallet[0].join()})`)
                                            );
                                        }
                                    }
                                    {...{
                                        height: 50,
                                        width: 50,
                                        src: e.cover,
                                    }}
                                />

                                <summary>
                                    <p>
                                        {
                                            e.name
                                        }
                                    </p>

                                    <small>
                                        {
                                            e.type === 0
                                                ? `${helper.humanNumber(e.played)} PLAYED`
                                                : `${e.size} Tracks`
                                        }
                                    </small>
                                </summary>
                            </figcaption>
                        </figure>
                    </Link>
                );
            }
        );
    }

    renderRecommend(recommend = {}) {
        var { classes, controller } = this.props;

        return (
            <Link
                className={classes.clearfix}
                to="#"
                onClick={
                    e => this.play(recommend)
                }
            >
                <Status
                    playing={controller.playlist.id === recommend.id}
                />

                <div className={classes.hovered}>
                    <i className="ion-android-arrow-forward" />
                </div>

                <figure className={clazz(classes.item, classes.recommend)}>
                    <figcaption>
                        <ProgressImage
                            className={classes.cover}
                            ref={
                                ele => {
                                    if (!ele || !recommend.pallet) return;

                                    var dom = ReactDOM.findDOMNode(ele);
                                    dom.style.boxShadow = `0 0 24px rgb(${recommend.pallet[1].join()})`;
                                }
                            }
                            {...{
                                height: 50,
                                width: 50,
                                src: recommend.cover,
                            }}
                        />

                        <summary>
                            <p>
                                {
                                    recommend.name
                                }
                            </p>

                            <small>
                                {
                                    `${recommend.size} Tracks`
                                }
                            </small>
                        </summary>
                    </figcaption>
                </figure>
            </Link>
        );
    }

    renderFavorite(favorite = {}) {
        var { classes, controller } = this.props;

        if (favorite.size === 0) {
            return false;
        }

        return (
            <Link
                className={classes.clearfix}
                to={favorite.link || '#'}
            >
                <Status
                    playing={controller.playlist.id === favorite.id}
                />

                <div className={classes.hovered}>
                    <i className="ion-android-arrow-forward" />
                </div>

                <figure
                    className={
                        clazz(classes.item, classes.favorite)
                    }
                >
                    <ProgressImage
                        {...{
                            className: classes.background,
                            width: 360,
                            src: favorite.background,
                        }}
                    />

                    <figcaption>
                        <ProgressImage
                            className={classes.cover}
                            ref={
                                ele => {
                                    if (!ele || !favorite.pallet) return;

                                    var dom = ReactDOM.findDOMNode(ele);
                                    dom.style.boxShadow = `0 0 24px rgb(${favorite.pallet[0].join()})`;
                                }
                            }
                            {...{
                                height: 50,
                                width: 50,
                                src: favorite.cover,
                            }}
                        />

                        <summary>
                            <p>
                                {
                                    favorite.name
                                }
                            </p>

                            <small>
                                {
                                    moment(favorite.updateTime).endOf('day').fromNow()
                                }
                            </small>
                        </summary>
                    </figcaption>
                </figure>
            </Link>
        );
    }

    renderProfile() {
        var { classes, me: { profile } } = this.props;
        var link = `/user/${profile.userId}`;

        return (
            <article className={classes.profile}>
                <Link
                    className="clearfix"
                    to={link}
                >
                    <FadeImage src={profile.avatarUrl} />
                </Link>

                <div className={classes.info}>
                    <p title={profile.nickname}>
                        <Link to={link}>
                            {
                                profile.nickname
                            }
                        </Link>
                    </p>
                    <span>
                        {profile.signature || 'No signature~'}
                    </span>
                </div>
            </article>
        );
    }

    render() {
        var { classes, controller, me, home } = this.props;
        var list = home.list;
        var logined = me.hasLogin();
        var hasRecommend = logined && list.length && list[1].size;

        return (
            <div className={classes.container}>
                <Loader show={home.loading} />

                <main>
                    <aside className={classes.navs}>
                        {
                            logined
                                ? this.renderProfile()
                                : (
                                    <Link
                                        to="/login/0"
                                        style={{
                                            fontSize: 14,
                                            letterSpacing: 2,
                                        }}
                                    >
                                        Sign in
                                    </Link>
                                )
                        }

                        <nav className={classes.menu}>
                            <p>
                                <Link to="/search">
                                    Search
                                </Link>
                            </p>

                            <p>
                                <Link to="/playlist/全部">
                                    Playlist
                                </Link>
                            </p>

                            <p>
                                <Link to="/top">
                                    Top podcasts
                                </Link>
                            </p>

                            <p>
                                <Link
                                    className={
                                        clazz({
                                            [classes.playing]: controller.playlist.id === 'PERSONAL_FM'
                                        })
                                    }
                                    to="/fm"
                                >
                                    Made For You
                                </Link>
                            </p>
                        </nav>
                    </aside>

                    {
                        list.length
                            ? (
                                <section className={classes.list}>
                                    {
                                        logined
                                            ? this.renderFavorite(list[0])
                                            : false
                                    }
                                    {
                                        hasRecommend
                                            ? this.renderRecommend(list[1])
                                            : false
                                    }
                                    {
                                        this.renderPlaylist(
                                            logined
                                                ? list.slice(2, list.length)
                                                : list.slice()
                                        )
                                    }
                                </section>
                            )
                            : (
                                <div className={classes.placeholder} />
                            )
                    }
                </main>

                <Controller key={controller.song.id} />
            </div>
        );
    }
}

export default injectSheet(classes)(Welcome);
