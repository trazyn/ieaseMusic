
import React from 'react';
import { render } from 'react-dom';
import { ThemeProvider } from 'react-jss';

import App from './app';
import theme from './theme';

render(
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>,
    document.getElementById('root')
);
