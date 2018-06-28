
import React, { Component } from 'react';
import injectSheet from 'react-jss';
import clazz from 'classname';

import classes from './classes';
import Switch from 'ui/Switch';

class Options extends Component {
    saveBackground(index, background) {
        var { preferences } = this.props;
        var backgrounds = preferences.backgrounds;

        backgrounds[index] = background;
        preferences.setBackgrounds(backgrounds);
    }

    saveLastfm() {
        var { preferences } = this.props;

        preferences.setLastfm({
            username: this.refs.username.value,
            password: this.refs.password.value,
            connected: preferences.lastfm.connected,
        });
    }

    setEnginers(value) {
        var { preferences } = this.props;

        preferences.setEnginers(Object.assign({}, preferences.enginers, value));
    }

    isConnected() {
        var { username, password, connected } = this.props.preferences.lastfm;

        return connected && `${username}:${password}` === connected;
    }

    render() {
        var { classes, preferences, close } = this.props;
        var {
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
            scrobble,
            setScrobble,
            lastfm,
            connect,
            connecting,
            enginers,
            proxy,
            setProxy,
        } = preferences;

        return (
            <div className={classes.container}>
                <header>
                    <span>
                        Preferences...
                    </span>

                    <i
                        className={classes.close}
                        onClick={() => close()}
                    >
                        <img
                            alt="Close Menus"
                            className={classes.close}
                            src="assets/close.png" />
                    </i>
                </header>

                <section>
                    <article>
                        <label htmlFor="alwaysOnTop">
                            <div>
                                <h4>Always on Top</h4>
                                <p>Make the player that stays on top</p>
                            </div>

                            <Switch
                                defaultChecked={alwaysOnTop}
                                id="alwaysOnTop"
                                onChange={e => setAlwaysOnTop(e.target.checked)} />
                        </label>

                        <label htmlFor="showTray">
                            <div>
                                <h4>Show menu bar icon</h4>
                                <p>If the menu bar icon is hidden, you can still access ieaseMusic using the dock icon.</p>
                            </div>

                            <Switch
                                defaultChecked={showTray}
                                id="showTray"
                                onChange={e => setShowTray(e.target.checked)} />
                        </label>

                        <label htmlFor="autoPlay">
                            <h4>Auto play at started</h4>

                            <Switch
                                defaultChecked={autoPlay}
                                id="autoPlay"
                                onChange={e => setAutoPlay(e.target.checked)} />
                        </label>

                        <label htmlFor="showNotification">
                            <h4>Show desktop notifications</h4>

                            <Switch
                                defaultChecked={showNotification}
                                id="showNotification"
                                onChange={e => setShowNotification(e.target.checked)} />
                        </label>

                        <label htmlFor="naturalScroll">
                            <div>
                                <h4>Scroll direction: Natural</h4>
                                <p>Content tracks finger movement.</p>
                            </div>

                            <Switch
                                defaultChecked={naturalScroll}
                                id="naturalScroll"
                                onChange={e => setNaturalScroll(e.target.checked)} />
                        </label>

                        <label htmlFor="highquality">
                            <h4>High Quality Music</h4>

                            <Switch
                                defaultChecked={highquality}
                                id="highquality"
                                onChange={e => setHighquality(+e.target.checked)} />
                        </label>

                        <label htmlFor="autoupdate">
                            <h4>Auto update</h4>

                            <Switch
                                defaultChecked={autoupdate}
                                id="autoupdate"
                                onChange={e => setAutoupdate(+e.target.checked)} />
                        </label>

                        <label htmlFor="scrobble">
                            <h4>Scrobble to NeteaseCloud Music</h4>

                            <Switch
                                defaultChecked={scrobble}
                                id="scrobble"
                                onChange={e => setScrobble(+e.target.checked)} />
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

                        <label
                            style={{
                                display: 'block',
                            }}>
                            <div>
                                <h4>HTTP proxy</h4>
                                <p>Need restart app.</p>
                            </div>

                            <input
                                className={classes.textInput}
                                defaultValue={proxy}
                                onBlur={ev => setProxy(ev.target.value)}
                                placeholder="http://your.proxy.com:port"
                            />
                        </label>
                    </article>

                    <article>
                        <h3>
                            Music search enginers
                        </h3>
                        <label htmlFor="enginerOfQQ">
                            <h4>QQ 音乐</h4>

                            <Switch
                                defaultChecked={enginers['QQ']}
                                id="enginerOfQQ"
                                onChange={e => this.setEnginers({ 'QQ': e.target.checked })} />
                        </label>
                        <label htmlFor="enginerOfMiGu">
                            <h4>咪咕音乐</h4>

                            <Switch
                                defaultChecked={enginers['MiGu']}
                                id="enginerOfMiGu"
                                onChange={e => this.setEnginers({ 'MiGu': e.target.checked })} />
                        </label>
                        <label htmlFor="enginerOfXiami">
                            <h4>虾米音乐</h4>

                            <Switch
                                defaultChecked={enginers['Xiami']}
                                id="enginerOfXiami"
                                onChange={e => this.setEnginers({ 'Xiami': e.target.checked })} />
                        </label>
                        <label htmlFor="enginerOfKugou">
                            <h4>酷狗音乐</h4>

                            <Switch
                                defaultChecked={enginers['Kugou']}
                                id="enginerOfKugou"
                                onChange={e => this.setEnginers({ 'Kugou': e.target.checked })} />
                        </label>
                        <label htmlFor="enginerOfBaidu">
                            <h4>百度音乐</h4>

                            <Switch
                                defaultChecked={enginers['Baidu']}
                                id="enginerOfBaidu"
                                onChange={e => this.setEnginers({ 'Baidu': e.target.checked })} />
                        </label>
                    </article>

                    <article>
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
                    </article>

                    <article>
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
                    </article>
                </section>
            </div>
        );
    }
}

export default injectSheet(classes)(Options);
