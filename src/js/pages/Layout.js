
import React, { Component } from 'react';
import injectSheet from 'react-jss';
import { inject, observer } from 'mobx-react';
import clazz from 'classname';

import Loader from 'ui/Loader';
import AudioPlayer from 'components/AudioPlayer';
import Search from 'components/Search';
import Menu from 'components/Menu';
import Playing from 'components/Playing';
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
    },
    hasLogin: stores.me.hasLogin,
    searching: stores.search.show,
}))
@observer
class Layout extends Component {
    async componentWillMount() {
        await this.props.init();
    }

    render() {
        var { classes, initialized, searching } = this.props;

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
