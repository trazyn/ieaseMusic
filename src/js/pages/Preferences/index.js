
import React, { Component } from 'react';
import { Link } from 'react-router';
import { inject, observer } from 'mobx-react';
import { ipcRenderer } from 'electron';
import injectSheet from 'react-jss';

import classes from './classes';
import Switch from 'ui/Switch';

@inject(stores => {
    var {
        showNotification,
        setShowNotification,
        autoPlay,
        setAutoPlay,
        alwaysOnTop,
        setAlwaysOnTop
    } = stores.preferences;

    return {
        showNotification,
        setShowNotification,
        autoPlay,
        setAutoPlay,
        alwaysOnTop,
        setAlwaysOnTop,
    };
})
@observer
class Preferences extends Component {
    updatePreferences() {
        ipcRenderer.send('update-preferences', {});
    }

    render() {
        var {
            classes,
            alwaysOnTop,
            setAlwaysOnTop,
            autoPlay,
            setAutoPlay,
            showNotification,
            setShowNotification,
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

                </section>
            </div>
        );
    }
}

export default injectSheet(classes)(Preferences);
