
/**
 * Setup and run the development server for Hot-Module-Replacement
 * https://webpack.github.io/docs/hot-module-replacement-with-webpack.html
 * @flow
 */
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import _debug from 'debug';

import config from '../config';
import webpackConfig from '../config/webpack.config.dev';

const debug = _debug('dev:server');
const app = new express();
const compiler = webpack(webpackConfig);

app.use(
    webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: {
            colors: true
        },
    })
);
app.use(webpackHotMiddleware(compiler));

app.listen(config.server.port, config.server.host, err => {
    if (err) {
        throw err;
    }

    debug(`Hot reload server is running with port ${config.server.port} 👏`);
});
