
import React, { Component } from 'react';
import { Link } from 'react-router';
import { inject, observer } from 'mobx-react';
import injectSheet from 'react-jss';
import clazz from 'classname';

import classes from './classes';
import Switch from 'ui/Switch';

@inject(stores => {
    var {
        showTray,
        setShowTray,
        showNotification,
        setShowNotification,
        autoPlay,
        setAutoPlay,
        alwaysOnTop,
        setAlwaysOnTop,
        naturalScroll,
        setNaturalScroll,
        port,
        setPort,
        highquality,
        setHighquality,
        backgrounds,
        setBackgrounds,
        autoupdate,
        setAutoupdate,
        lastfm,
        setLastfm,
        connect,
        connecting,
    } = stores.preferences;

    return {
        showTray,
        setShowTray,
        showNotification,
        setShowNotification,
        autoPlay,
        setAutoPlay,
        alwaysOnTop,
        setAlwaysOnTop,
        naturalScroll,
        setNaturalScroll,
        port,
        setPort,
        highquality,
        setHighquality,
        backgrounds,
        setBackgrounds,
        autoupdate,
        setAutoupdate,
        lastfm,
        setLastfm,
        connect,
        connecting,
    };
})
@observer
class Preferences extends Component {
    saveBackground(index, background) {
        var backgrounds = this.props.backgrounds;

        backgrounds[index] = background;
        this.props.setBackgrounds(backgrounds);
    }

    saveLastfm() {
        this.props.setLastfm({
            username: this.refs.username.value,
            password: this.refs.password.value,
            connected: this.props.lastfm.connected,
        });
    }

    isConnected() {
        var { username, password, connected } = this.props.lastfm;

        return connected && `${username}:${password}` === connected;
    }

    render() {
        var {
            classes,
            showTray,
            setShowTray,
            alwaysOnTop,
            setAlwaysOnTop,
            autoPlay,
            setAutoPlay,
            naturalScroll,
            setNaturalScroll,
            showNotification,
            setShowNotification,
            port,
            setPort,
            highquality,
            setHighquality,
            backgrounds,
            autoupdate,
            setAutoupdate,
            lastfm,
            connect,
            connecting,
        } = this.props;

        return (
            <div className={classes.container}>
                <header>
                    Preferences...

                    <Link to="/">
                        <img
                            alt="Close Menus"
                            className={classes.close}
                            src="assets/close.png" />
                    </Link>
                </header>

                <section>
                    <label htmlFor="alwaysOnTop">
                        <div>
                            <h4>Always on Top</h4>
                            <p>Make the player that stays on top</p>
                        </div>

                        <Switch
                            checked={alwaysOnTop}
                            id="alwaysOnTop"
                            onChange={e => setAlwaysOnTop(e.target.checked)} />
                    </label>

                    <label htmlFor="showTray">
                        <div>
                            <h4>Show menu bar icon</h4>
                            <p>If the menu bar icon is hidden, you can still access ieaseMusic using the dock icon.</p>
                        </div>

                        <Switch
                            checked={showTray}
                            id="showTray"
                            onChange={e => setShowTray(e.target.checked)} />
                    </label>

                    <label htmlFor="autoPlay">
                        <h4>Auto play at started</h4>

                        <Switch
                            checked={autoPlay}
                            id="autoPlay"
                            onChange={e => setAutoPlay(e.target.checked)} />
                    </label>

                    <label htmlFor="showNotification">
                        <h4>Show desktop notifications</h4>

                        <Switch
                            checked={showNotification}
                            id="showNotification"
                            onChange={e => setShowNotification(e.target.checked)} />
                    </label>

                    <label htmlFor="naturalScroll">
                        <div>
                            <h4>Scroll direction: Natural</h4>
                            <p>Content tracks finger movement.</p>
                        </div>

                        <Switch
                            checked={naturalScroll}
                            id="naturalScroll"
                            onChange={e => setNaturalScroll(e.target.checked)} />
                    </label>

                    <label htmlFor="highquality">
                        <h4>High Quality Music</h4>

                        <Switch
                            checked={highquality}
                            id="highquality"
                            onChange={e => setHighquality(+e.target.checked)} />
                    </label>

                    <label htmlFor="autoupdate">
                        <h4>Auto update</h4>

                        <Switch
                            checked={autoupdate}
                            id="autoupdate"
                            onChange={e => setAutoupdate(+e.target.checked)} />
                    </label>

                    <label
                        style={{
                            display: 'block',
                        }}>
                        <div>
                            <h4>API server port</h4>
                            <p>After change port, you need restart the app.</p>
                        </div>

                        <input
                            className={classes.textInput}
                            min="1000"
                            max="65535"
                            defaultValue={port}
                            onBlur={ev => setPort(+ev.target.value)}
                            placeholder="1000 ~ 65535"
                            type="number" />
                    </label>

                    <h3>
                        Connect to Last.fm
                        <small>Track what you listen to, whenever you listen.</small>
                    </h3>
                    <div className={classes.field}>
                        <span>Username</span>
                        <input
                            className={classes.textInput}
                            defaultValue={lastfm.username}
                            onBlur={ev => this.saveLastfm()}
                            placeholder="Your last.fm username"
                            ref="username"
                            type="text" />
                    </div>

                    <div className={classes.field}>
                        <span>Password</span>
                        <input
                            className={classes.textInput}
                            defaultValue={lastfm.password}
                            onBlur={ev => this.saveLastfm()}
                            placeholder="Your last.fm password"
                            ref="password"
                            type="password" />
                    </div>
                    <button
                        className={clazz(classes.connect, {
                            [classes.connected]: this.isConnected(),
                        })}
                        disabled={this.isConnected() || connecting || !lastfm.username || !lastfm.password}
                        onClick={e => connect()}>
                        {
                            connecting ? (
                                <span>
                                    <i className="ion-ios-loop" />
                                    Connecting to Last.fm
                                </span>
                            ) : (
                                this.isConnected() ? (
                                    <span>
                                        <i className="ion-android-done" />
                                        Connected to Last.fm
                                    </span>
                                ) : (
                                    <span>
                                        <i className="ion-flash" />
                                        Connect to Last.fm
                                    </span>
                                )
                            )
                        }
                    </button>

                    <h3>Playlist Background ...</h3>
                    {
                        backgrounds.map((e, index) => {
                            return (
                                <div
                                    className={classes.field}
                                    key={index}>
                                    <span>{e.type}</span>
                                    <input
                                        className={classes.textInput}
                                        defaultValue={e.background}
                                        onBlur={ev => this.saveBackground(index, {
                                            type: e.type,
                                            background: ev.target.value,
                                        })}
                                        placeholder="Please entry the background address"
                                        type="text" />
                                </div>
                            );
                        })
                    }
                </section>
            </div>
        );
    }
}

export default injectSheet(classes)(Preferences);
