
import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react';
import { ipcRenderer } from 'electron';
import injectSheet from 'react-jss';
import clazz from 'classname';

import classes from './classes';

@inject(stores => ({
    subscribed: stores.player.meta.subscribed,
    hasLogin: stores.me.hasLogin,
    subscribe: stores.player.subscribe,
    showMenu: () => stores.menu.toggle(true),
    showPlaying: () => stores.playing.toggle(true),
}))
@observer
class Header extends Component {
    static propTypes = {
        followed: PropTypes.bool,
        showBack: PropTypes.bool,
        showFav: PropTypes.bool,
        showPlaylist: PropTypes.bool,
        showFollow: PropTypes.bool,
        color: PropTypes.string,
    };

    static defaultProps = {
        followed: false,
        showBack: true,
        showFav: false,
        showPlaylist: true,
        showFollow: false,
        color: '#654b58',
    };

    goBack = () => this._reactInternalInstance._context.router.goBack();

    renderBack() {
        var { showBack, color } = this.props;

        if (!showBack) {
            return false;
        }

        return (
            <i
                className="ion-android-arrow-back"
                onClick={e => this.goBack()}
                style={{
                    color,
                }} />
        );
    }

    renderFollow() {
        var { classes, hasLogin, showFollow, followed } = this.props;

        if (!hasLogin()) {
            return false;
        }

        if (showFollow) {
            return (
                <button
                    className={clazz(classes.follow, {
                        [classes.followed]: followed,
                    })}
                    onClick={e => {}}>
                    Follow
                </button>
            );
        }

        return false;
    }

    renderPlaylist() {
        var { showPlaylist, showPlaying, color } = this.props;

        if (showPlaylist) {
            return (
                <i
                    className="ion-stats-bars"
                    onClick={() => showPlaying()}
                    style={{
                        color,
                    }} />
            );
        }

        return false;
    }

    renderFav() {
        var { hasLogin, showFav, color, subscribed, subscribe } = this.props;

        if (!showFav
            || !hasLogin()) {
            return false;
        }

        if (subscribed) {
            return (
                <i
                    className={clazz('ion-ios-star', this.props.classes.subscribed)}
                    onClick={e => subscribe(false)} />
            );
        }

        return (
            <i
                className="ion-ios-star-outline"
                style={{
                    color,
                }}
                onClick={e => subscribe(true)} />
        );
    }

    renderMenu() {
        return (
            <i
                className="ion-android-more-vertical"
                onClick={() => this.props.showMenu()}
                style={{
                    color: this.props.color,
                }} />
        );
    }

    render() {
        var classes = this.props.classes;

        return (
            <header className={classes.container}>
                <div>
                    {
                        this.renderBack()
                    }
                </div>

                <div>
                    {
                        this.renderFollow()
                    }
                    {
                        this.renderPlaylist()
                    }

                    {
                        this.renderFav()
                    }

                    {
                        this.renderMenu()
                    }

                    <i
                        className="ion-ios-arrow-down"
                        onClick={e => ipcRenderer.send('minimize')}
                        style={{
                            color: this.props.color,
                        }} />
                </div>
            </header>
        );
    }
}

export default injectSheet(classes)(Header);
