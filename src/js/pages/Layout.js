
import React, { Component } from 'react';
import injectSheet from 'react-jss';
import { inject, observer } from 'mobx-react';
import clazz from 'classname';

import Offline from 'ui/Offline';
import Loader from 'ui/Loader';
import ProgressImage from 'ui/ProgressImage';
import lastfm from 'utils/lastfm';
import Preferences from 'components/Preferences';
import AudioPlayer from 'components/AudioPlayer';
import Menu from 'components/Menu';
import Playing from 'components/Playing';
import VolumeUpDown from 'components/Ripple/VolumeUpDown';
import PlayerNavigation from 'components/Ripple/PlayerNavigation';
import PlayerMode from 'components/Ripple/PlayerMode';
import PlayerStatus from 'components/Ripple/PlayerStatus';
import UpNext from 'components/UpNext';

const classes = {
    container: {
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
    },

    viewport: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 2,
    },

    background: {
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
    },

    cover: {
        '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: '100%',
            background: 'rgba(0, 0, 0, .3)',
            zIndex: 1
        },
    },
};

@inject(stores => ({
    initialized: stores.me.initialized,
    init: async() => {
        await stores.preferences.init();
        await stores.me.init();

        var { username, password } = stores.preferences.lastfm;

        await lastfm.initialize(username, password);
    },
    song: stores.controller.song,
    hasLogin: stores.me.hasLogin,
}))
@observer
class Layout extends Component {
    state = {
        offline: false,
    };

    async componentWillMount() {
        await this.props.init();
    }

    componentDidMount() {
        window.addEventListener('offline', () => {
            this.setState({
                offline: true,
            });
        });

        window.addEventListener('online', () => {
            this.setState({
                offline: false,
            });
        });
    }

    render() {
        var { classes, initialized, song } = this.props;

        if (this.state.offline) {
            return <Offline show={true} />;
        }

        // Wait for app has initialized
        if (!initialized) {
            return <Loader show={true} />;
        }

        return (
            <div
                className={classes.container}
            >
                <main
                    className={
                        clazz({
                            [classes.viewport]: true,
                        })
                    }
                >
                    {this.props.children}
                </main>

                <UpNext />
                <Preferences />
                <Menu />
                <VolumeUpDown />
                <Playing />
                <AudioPlayer />
                <PlayerNavigation />
                <PlayerMode />
                <PlayerStatus />

                <div className={classes.cover}>
                    {
                        song.id
                            ? (
                                <ProgressImage
                                    className={classes.background}
                                    {...{
                                        width: window.innerWidth,
                                        src: song.album.cover.replace(/\?param=.*/, '') + '?param=800y800',
                                    }}
                                />
                            )
                            : false
                    }
                </div>
            </div>
        );
    }
}

export default injectSheet(classes)(Layout);
