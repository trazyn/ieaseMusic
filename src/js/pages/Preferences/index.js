
import React, { Component } from 'react';
import { Link } from 'react-router';
import { inject, observer } from 'mobx-react';
import injectSheet from 'react-jss';

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
    };
})
@observer
class Preferences extends Component {
    saveBackground(index, background) {
        var backgrounds = this.props.backgrounds;

        backgrounds[index] = background;
        this.props.setBackgrounds(backgrounds);
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

                    <h3>Playlist Background ...</h3>
                    {
                        backgrounds.map((e, index) => {
                            return (
                                <div
                                    className={classes.background}
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
