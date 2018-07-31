
import { webFrame } from 'electron';
import React from 'react';
import { render } from 'react-dom';
import { ThemeProvider } from 'react-jss';

import App from './app';
import theme from 'config/theme';

webFrame.setVisualZoomLevelLimits(1, 1);
webFrame.setLayoutZoomLevelLimits(0, 0);

render(
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>,
    document.getElementById('root')
);
