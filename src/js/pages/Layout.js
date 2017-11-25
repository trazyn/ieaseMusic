
import React, { Component } from 'react';
import injectSheet from 'react-jss';
import { inject, observer } from 'mobx-react';
import clazz from 'classname';

import Offline from 'ui/Offline';
import Loader from 'ui/Loader';
import lastfm from 'utils/lastfm';
import AudioPlayer from 'components/AudioPlayer';
import Search from 'components/Search';
import Menu from 'components/Menu';
import Playing from 'components/Playing';
import Comments from 'components/Comments';
import VolumeUpDown from 'components/Ripple/VolumeUpDown';
import PlayerNavigation from 'components/Ripple/PlayerNavigation';
import PlayerMode from 'components/Ripple/PlayerMode';
import PlayerStatus from 'components/Ripple/PlayerStatus';

const classes = {
    container: {
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
    },

    mask: {
        filter: 'blur(10px)',
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
    hasLogin: stores.me.hasLogin,
    searching: stores.search.show,
    showComments: stores.comments.show,
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
        var { classes, initialized, searching, showComments } = this.props;

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
                ref="container">
                <div className={clazz({
                    [classes.mask]: searching,
                })}>
                    {this.props.children}
                </div>

                {
                    showComments && <Comments />
                }

                <Menu />
                <Search />
                <VolumeUpDown />
                <Playing />
                <AudioPlayer />
                <PlayerNavigation />
                <PlayerMode />
                <PlayerStatus />
            </div>
        );
    }
}

export default injectSheet(classes)(Layout);
