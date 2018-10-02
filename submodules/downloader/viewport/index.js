
import React from 'react';
import { render } from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { ThemeProvider } from 'react-jss';
import 'ionicons201/css/ionicons.css';

import 'app/global.css';
import theme from 'config/theme';
import stores from './stores';
import Downloader from './views/Downloader';
import List from './views/List';

/* eslint-disable */
render(
    <ThemeProvider theme={theme}>
        <Provider stores={stores}>
            <HashRouter>
                <Switch>
                    <Route exact path="/" component={Downloader} />
                    <Route exact path="/list" component={List} />
                </Switch>
            </HashRouter>
        </Provider>
    </ThemeProvider>,
    document.getElementById('root')
);
/* eslint-enable */
