
import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import Layout from './pages/Layout';
import Welcome from './pages/Welcome';
import Player from './pages/Player';
import User from './pages/User';
import Artist from './pages/Artist';
import Top from './pages/Top';
import Playlist from './pages/Playlist';
import FM from './pages/FM';
import Singleton from './pages/Singleton';
import Comments from './pages/Comments';
import Lyrics from './pages/Lyrics';
import Search from './pages/Search';
import { Legacy as LoginByLegacy, QRCode as LoginByQrCode } from './pages/Login';
import stores from 'stores';

function requireAuth(component, props) {
    if (stores.me.hasLogin()) {
        return (
            React.createElement(
                component,
                {
                    ...props,
                }
            )
        );
    }

    return <Redirect to={`/login/1`} />;
}

const Main = withRouter(props => <Layout {...props} />);

export default () => {
    return (
        /* eslint-disable */
        <Main>
            <Switch>
                <Route exact path="/" component={Welcome} />
                <Route exact path="/login/:fm" component={LoginByLegacy} />
                <Route exact path="/login/qrcode/:type/:fm" component={LoginByQrCode} />
                <Route exact path="/player/:type/:id" component={Player} />
                <Route exact path="/user/:id" component={User} />
                <Route exact path="/artist/:id" component={Artist} />
                <Route exact path="/top" component={Top} />
                <Route exact path="/playlist/:type" component={Playlist} />
                <Route exact path="/singleton" component={Singleton} />
                <Route exact path="/comments" component={Comments} />
                <Route exact path="/lyrics" component={Lyrics} />
                <Route exact path="/search" component={Search} />

                <Route
                    exact
                    path="/fm"
                    render={props => requireAuth(FM, props)}
                />
            </Switch>
        </Main>
        /* eslint-enable */
    );
};
