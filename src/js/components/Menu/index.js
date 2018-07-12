
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { remote } from 'electron';
import { inject, observer } from 'mobx-react';
import injectSheet from 'react-jss';
import clazz from 'classname';

import classes from './classes';
import FadeImage from 'ui/FadeImage';

@inject(stores => ({
    show: stores.menu.show,
    hasLogin: stores.me.hasLogin,
    profile: stores.me.profile,
    logout: stores.me.logout,
    close: () => stores.menu.toggle(false),
}))
@observer
class Menu extends Component {
    doLogout() {
        // Clear cookies
        remote.getCurrentWindow().webContents.session.clearStorageData();
        this.props.logout();
    }

    renderMe() {
        var { classes, close, hasLogin, profile } = this.props;
        var link = `/user/${profile.userId}`;

        if (!hasLogin()) {
            return (
                <p>
                    <Link
                        onClick={close}
                        to="/login/0">
                        Sign in
                    </Link>
                </p>
            );
        }

        return (
            <article className={classes.profile}>
                <Link
                    className="clearfix"
                    onClick={close}
                    to={link}>
                    <FadeImage src={profile.avatarUrl} />
                </Link>

                <div className={classes.info}>
                    <p
                        className={classes.username}
                        onClick={close}
                        title={profile.nickname}>
                        <Link to={link}>{profile.nickname}</Link>
                    </p>
                    <a
                        className={classes.logout}
                        href=""
                        onClick={e => this.doLogout()}>
                        Logout
                    </a>
                </div>
            </article>
        );
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.show === true) {
            setTimeout(() => {
                this.container.focus();
            });
        }
    }

    render() {
        var { classes, show, close } = this.props;

        if (!show) {
            return false;
        }

        return (
            <div
                tabIndex="-1"
                className={classes.container}
                // Press ESC close menu
                onKeyUp={e => e.keyCode === 27 && this.props.close()}
                ref={
                    ele => (this.container = ele)
                }
            >
                <div
                    className={classes.overlay}
                    onClick={this.props.close} />
                <section className={classes.body}>
                    <div>
                        {
                            this.renderMe()
                        }

                        <div className={classes.navs}>
                            <p>
                                <Link
                                    onClick={close}
                                    to="/">
                                    Home
                                </Link>
                            </p>
                            <p>
                                <Link
                                    onClick={close}
                                    to="/search">
                                    Search
                                </Link>
                            </p>
                            <p>
                                <Link
                                    onClick={close}
                                    to="/playlist/全部">
                                    Playlist
                                </Link>
                            </p>
                            <p>
                                <Link
                                    onClick={close}
                                    to="/top">
                                    Top
                                </Link>
                            </p>

                            <p>
                                <Link
                                    onClick={close}
                                    to="/fm">
                                    Made For You
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className={classes.social}>
                        <a
                            className={clazz('tooltip', classes.github)}
                            data-text="Fork me on Github"
                            href="https://github.com/trazyn"
                            target="_blank">
                            <i className="ion-social-github" />
                        </a>

                        <a
                            className={clazz('tooltip', classes.twitter)}
                            data-text="Follow me on Twitter 😘"
                            href="https://twitter.com/var_darling"
                            target="_blank">
                            <i className="ion-social-twitter" />
                        </a>
                    </div>
                </section>
            </div>
        );
    }
}

export default injectSheet(classes)(Menu);
