
import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, hashHistory } from 'react-router';
import { Provider } from 'mobx-react';
import { ThemeProvider } from 'react-jss';

import './global.css';
import 'utils/albumColors';
import theme from './theme';
import getRoutes from './js/routes';
import stores from './js/stores';

class App extends Component {
    render() {
        return (
            <Provider {...stores}>
                <Router history={hashHistory}>
                    {getRoutes()}
                </Router>
            </Provider>
        );
    }
}

render(
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>,
    document.getElementById('root')
);
