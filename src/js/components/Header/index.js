
import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react';
import injectSheet from 'react-jss';
import clazz from 'classname';

import classes from './classes';
import menu from 'stores/menu';

@inject(stores => ({
    subscribed: stores.player.meta.subscribed,
    followed: stores.user.profile.followed,
}))
@observer
class Header extends Component {
    static propTypes = {
        showBack: PropTypes.bool,
        showFav: PropTypes.bool,
        showPlaylist: PropTypes.bool,
        showFollow: PropTypes.bool,
        color: PropTypes.string,
    };

    static defaultProps = {
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
        var { showFollow, classes, followed } = this.props;

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
        var { showPlaylist, color } = this.props;

        if (showPlaylist) {
            return (
                <i
                    className="ion-stats-bars"
                    style={{
                        color,
                    }} />
            );
        }

        return false;
    }

    renderFav() {
        var { showFav, color, subscribed } = this.props;

        if (!showFav) {
            return false;
        }

        if (subscribed) {
            return (
                <i
                    className={clazz('ion-ios-star', this.props.classes.subscribed)}
                    onClick={e => {}} />
            );
        }

        return (
            <i
                className="ion-ios-star-outline"
                style={{
                    color,
                }} />
        );
    }

    renderMenu() {
        return (
            <i
                className="ion-android-more-vertical"
                onClick={() => menu.toggle(true)}
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
                </div>
            </header>
        );
    }
}

export default injectSheet(classes)(Header);
