
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import injectSheet from 'react-jss';
import clazz from 'classname';

import classes from './classes';
import helper from 'utils/helper';
import Loader from 'ui/Loader';
import ProgressImage from 'ui/ProgressImage';
import Header from 'components/Header';
import Controller from 'components/Controller';

@inject(stores => ({
    loading: stores.user.loading,
    getUser: stores.user.getUser,
    profile: stores.user.profile,
    playlists: stores.user.playlists,
    follow: stores.user.follow,
    controller: stores.controller,
    isme: () => stores.user.profile.id === stores.me.profile.userId.toString(),
    isPlaying: id => {
        var controller = stores.controller;

        return controller.playing && controller.playlist.id === id;
    },
}))
@observer
class User extends Component {
    componentWillMount = () => this.props.getUser(this.props.match.params.id);

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            nextProps.getUser(nextProps.match.params.id);
        }
    }

    state = {
        hovered: false
    };

    renderList() {
        var { classes, playlists } = this.props;

        return playlists.map(
            (e, index) => {
                return (
                    <Link
                        className={
                            clazz('clearfix', classes.item, {
                                [classes.playing]: this.props.isPlaying(e.id),
                            })
                        }
                        to={e.link}
                        key={index}
                        onMouseEnter={
                            ev => this.setState({ hovered: e })
                        }
                        onMouseLeave={
                            ev => this.setState({ hovered: false })
                        }
                    >
                        <h2>
                            <span>{e.name}</span>
                        </h2>

                        <p className={classes.played}>
                            <span>
                                {helper.humanNumber(e.played)}
                                Played
                            </span>
                        </p>
                    </Link>
                );
            }
        );
    }

    render() {
        var { classes, loading, profile, isme, follow, controller } = this.props;
        var hovered = this.state.hovered;
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
                        display: isme() ? 'none' : 'block',
                    }}
                    className={
                        clazz(classes.follow, {
                            [classes.followed]: followed,
                        })
                    }
                    onClick={e => follow(followed)}
                >
                    {followed ? 'Followed' : 'Follow'}
                </button>

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
                    <img
                        src={profile.avatar}
                        className={classes.avatar}
                        style={
                            {
                                width: window.innerWidth,
                                height: window.innerWidth,
                            }
                        }
                        onLoad={
                            e => {
                                e.target.classList.add(classes.expose);
                            }
                        }
                    />

                    <div className={classes.overlay} />
                </figure>

                <main>
                    <aside className={classes.hero}>
                        <div style={{ width: 200 }}>
                            <h3>{ profile.name }</h3>

                            <p data-label="Followers">
                                {helper.formatNumber(profile.followers)}
                            </p>

                            <p data-label="Following">
                                {helper.formatNumber(profile.following)}
                            </p>

                            <div className={classes.signature}>
                                <span title={profile.signature}>
                                    {profile.signature || 'No signature~'}
                                </span>
                            </div>
                        </div>

                        <ProgressImage
                            className={classes.preview}
                            {...{
                                height: 260,
                                width: 260,
                                src: hovered ? hovered.cover : profile.avatar,
                            }}
                        />
                    </aside>

                    <section className={classes.list}>
                        {
                            this.renderList()
                        }
                    </section>
                </main>

                <Controller key={controller.song.id} />

            </div>
        );
    }
}

export default injectSheet(classes)(User);
