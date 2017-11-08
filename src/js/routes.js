
import React from 'react';
import { IndexRoute, Route } from 'react-router';

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

export default () => {
    return (
        <Route path="/" component={Layout}>
            <IndexRoute component={Home} />
            <Route path="/login/:fm" component={Login} />
            <Route path="/player/:type/:id" component={Player} />
            <Route path="/user/:id" component={User} />
            <Route path="/artist/:id" component={Artist} />
            <Route path="/top" component={Top} />
            <Route path="/playlist/:type" component={Playlist} />
            <Route path="/fm" component={FM} onEnter={requireAuth} />
            <Route path="/preferences" component={Preferences} />
        </Route>
    );
};
