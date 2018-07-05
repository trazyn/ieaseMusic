
import React, { Component } from 'react';
import Scroller from 'react-scroll-horizontal';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import injectSheet from 'react-jss';
import clazz from 'classname';

import classes from './classes';
import helper from 'utils/helper';
import ProgressImage from 'ui/ProgressImage';
import Loader from 'ui/Loader';
import Header from 'components/Header';

@inject(stores => ({
    loading: stores.user.loading,
    getUser: stores.user.getUser,
    song: stores.controller.song,
    profile: stores.user.profile,
    playlists: stores.user.playlists,
    follow: stores.user.follow,
    isme: () => stores.user.profile.id === stores.me.profile.userId.toString(),
    isPlaying: (id) => {
        var controller = stores.controller;

        return controller.playing
            && controller.playlist.id === id;
    },
    naturalScroll: stores.preferences.naturalScroll,
}))
@observer
class User extends Component {
    componentWillMount = () => this.props.getUser(this.props.match.params.id);

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            nextProps.getUser(nextProps.match.params.id);
        }
    }

    renderList() {
        var { classes, playlists, naturalScroll } = this.props;

        return (
            <Scroller reverseScroll={!naturalScroll}>
                {
                    () => (
                        playlists.map(
                            (e, index) => {
                                return (
                                    <Link
                                        className={
                                            clazz(
                                                'clearfix',
                                                classes.item,
                                                {
                                                    [classes.playing]: this.props.isPlaying(e.id)
                                                }
                                            )
                                        }
                                        to={e.link}
                                        key={index}
                                    >
                                        <ProgressImage
                                            {...{
                                                height: 120,
                                                width: 120,
                                                src: e.cover,
                                            }}
                                        />

                                        <div className={classes.meta}>
                                            <p className={classes.name}>
                                                <span>{e.name}</span>
                                            </p>
                                            <p className={classes.played}>
                                                <span>{helper.humanNumber(e.played)} Played</span>
                                            </p>
                                        </div>
                                    </Link>
                                );
                            }
                        )
                    )
                }
            </Scroller>
        );
    }

    render() {
        var { classes, loading, song, profile, isme, follow } = this.props;
        var followed = profile.followed;

        // Force rerender all, let image progressively load
        if (loading) {
            return <Loader show={true} />;
        }

        return (
            <div className={classes.container}>
                <Header
                    {...{
                        transparent: true,
                        showBack: true,
                        showPlaylist: true,
                    }}
                />

                <button
                    style={{
                        display: isme() ? 'none' : 'block'
                    }}
                    className={
                        clazz(classes.follow, {
                            [classes.followed]: followed,
                        })
                    }
                    onClick={e => follow(followed)}
                >
                    {
                        followed ? 'Followed' : 'Follow'
                    }
                </button>

                {
                    song.id
                        ? (
                            <figure
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    height: '100%',
                                    width: '100%',
                                    padding: 0,
                                    margin: 0,
                                    overflow: 'hidden',
                                }}
                            >
                                <figcaption
                                    style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        width: window.innerWidth,
                                        height: window.innerWidth,
                                        padding: 0,
                                        margin: 0,
                                        backgroundImage: `url(${song.album.cover.replace(/\?param=.*/, '') + '?param=800y800'})`,
                                        backgroundSize: `${window.innerWidth}px ${window.innerWidth}px`,
                                        filter: 'blur(10px)',
                                        zIndex: -1,
                                    }}
                                />
                            </figure>
                        )
                        : false
                }

                <div className={classes.hero}>
                    <ProgressImage
                        {...{
                            height: 260,
                            width: 260,
                            src: profile.avatar,
                        }}
                    />

                    <div className={classes.info}>
                        <p className={classes.username}>
                            <span>
                                {profile.name}
                            </span>
                        </p>

                        <p className={classes.followers}>
                            <span>
                                {helper.formatNumber(profile.followers)} Followers
                            </span>
                        </p>

                        <p className={classes.signature}>
                            <span>
                                {profile.signature || 'No signature~'}
                            </span>
                        </p>
                    </div>
                </div>

                <div className={classes.list}>
                    {
                        this.renderList()
                    }
                </div>
            </div>
        );
    }
}

export default injectSheet(classes)(User);
