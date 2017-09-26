
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
            showNotification,
            setShowNotification,
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

                    <h3>Playlist Background ...</h3>
                    {
                        backgrounds.map((e, index) => {
                            return (
                                <div
                                    className={classes.background}
                                    key={index}>
                                    <span>{e.type}</span>
                                    <input
                                        type="text"
                                        defaultValue={e.background}
                                        onBlur={ev => this.saveBackground(index, {
                                            type: e.type,
                                            background: ev.target.value,
                                        })}
                                        placeholder="Please entry the background address" />
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
