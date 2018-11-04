
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, ModalBody, ModalHeader } from 'ui/Modal';
import injectSheet, { ThemeProvider } from 'react-jss';
import clazz from 'classname';

import classes from './classes';
import Switch from 'ui/Switch';
import theme from 'config/theme';

@inject('preferences')
@observer
class Preferences extends Component {
    close() {
        this.props.preferences.show = false;
    }

    saveBackground(index, background) {
        var { preferences } = this.props;
        var backgrounds = preferences.backgrounds;

        backgrounds[index] = background;
        preferences.setBackgrounds(backgrounds);
    }

    saveLastfm() {
        var { preferences } = this.props;

        preferences.setLastfm({
            username: this.username.value,
            password: this.password.value,
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

    choiceDownloadDir(e) {
        e.preventDefault();
        this.downloads.click();
    }

    renderOptions() {
        var { classes, preferences } = this.props;
        var {
            showTray,
            setShowTray,
            showMenuBarOnLinux,
            setShowMenuBarOnLinux,
            revertTrayIcon,
            setRevertTrayIcon,
            alwaysOnTop,
            setAlwaysOnTop,
            autoPlay,
            setAutoPlay,
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
            downloads,
            setDownloads,
        } = preferences;

        return (
            <div className={classes.container}>
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

                        <label htmlFor="showMenuBarOnLinux">
                            <div>
                                <h4>Show menu bar on Linux</h4>
                                <p>Only work on Linux. Restart needed.</p>
                            </div>

                            <Switch
                                defaultChecked={showMenuBarOnLinux}
                                id="showMenuBarOnLinux"
                                onChange={e => setShowMenuBarOnLinux(e.target.checked)} />
                        </label>

                        <label htmlFor="revertTrayIcon">
                            <div>
                                <h4>Revert tray icon to fit dark panel</h4>
                            </div>

                            <Switch
                                defaultChecked={revertTrayIcon}
                                id="revertTrayIcon"
                                onChange={e => setRevertTrayIcon(e.target.checked)} />
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

                        <label htmlFor="highquality">
                            <div>
                                <h4>Only High Quality</h4>
                                <p>Only the high quality track accepted, Usually you not need enable this option.</p>
                            </div>

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

                        <label className={classes.downloads}>
                            <aside>
                                <input
                                    webkitdirectory="true"
                                    onChange={e => setDownloads(e.target.files[0])}
                                    ref={ele => (this.downloads = ele)}
                                    type="file"
                                />
                                <h4>Downloads</h4>
                                <p onClick={e => this.choiceDownloadDir(e)}>{downloads}</p>
                            </aside>

                            <button onClick={e => this.choiceDownloadDir(e)}>Change</button>
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
                        <label htmlFor="enginerOfKuwo">
                            <h4>酷我音乐</h4>

                            <Switch
                                defaultChecked={enginers['Kuwo']}
                                id="enginerOfKuwo"
                                onChange={e => this.setEnginers({ 'Kuwo': e.target.checked })} />
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
                                ref={
                                    ele => (this.username = ele)
                                }
                                type="text" />
                        </div>

                        <div className={classes.field}>
                            <span>Password</span>
                            <input
                                className={classes.textInput}
                                defaultValue={lastfm.password}
                                onBlur={ev => this.saveLastfm()}
                                placeholder="Your last.fm password"
                                ref={
                                    ele => (this.password = ele)
                                }
                                type="password" />
                        </div>
                        <button
                            className={
                                clazz(classes.connect, {
                                    [classes.connected]: this.isConnected(),
                                })
                            }
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
                                        key={index}
                                    >
                                        <span>{e.type}</span>

                                        <input
                                            className={classes.textInput}
                                            defaultValue={e.background}
                                            onBlur={
                                                ev => this.saveBackground(index, {
                                                    type: e.type,
                                                    background: ev.target.value,
                                                })
                                            }
                                            placeholder="Please entry the background address"
                                            type="text"
                                        />
                                    </div>
                                );
                            })
                        }
                    </article>
                </section>
            </div>
        );
    }

    render() {
        var { classes, preferences } = this.props;

        return (
            <Modal
                show={preferences.show}
                onCancel={() => this.close()}
            >
                <ModalHeader
                    className={classes.header}
                >
                    Preferences...

                    <i
                        className={classes.close}
                        onClick={() => this.close()}
                    >
                        <img
                            alt="Close Menus"
                            className={classes.close}
                            src="assets/close.png" />
                    </i>
                </ModalHeader>

                <ModalBody
                    className={classes.modal}
                >
                    <ThemeProvider theme={theme}>
                        {
                            this.renderOptions()
                        }
                    </ThemeProvider>
                </ModalBody>
            </Modal>
        );
    }
}

export default injectSheet(classes)(Preferences);
