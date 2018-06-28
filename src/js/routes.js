
import React from 'react';
import { withRouter, Route } from 'react-router-dom';

import Layout from './pages/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Player from './pages/Player';
import User from './pages/User';
import Artist from './pages/Artist';
import Top from './pages/Top';
import Playlist from './pages/Playlist';
import FM from './pages/FM';
import Preferences from './pages/Preferences';
import stores from 'stores';

function requireAuth(nextState, replace) {
    if (!stores.me.hasLogin()) {
        replace({
            pathname: '/login/1'
        });
    }
}

const Main = withRouter(props => <Layout {...props} />);

export default () => {
    return (
        /* eslint-disable */
        <Main>
            <Route exact path="/" component={Home} />
            <Route exact path="/login/:fm" component={Login} />
            <Route exact path="/player/:type/:id" component={Player} />
            <Route exact path="/user/:id" component={User} />
            <Route exact path="/artist/:id" component={Artist} />
            <Route exact path="/top" component={Top} />
            <Route exact path="/playlist/:type" component={Playlist} />
            <Route exact path="/fm" component={FM} onEnter={requireAuth} />
            <Route exact path="/preferences" component={Preferences} />
        </Main>
        /* eslint-enable */
    );
};
