
import webpack from 'webpack';
import config from './index';
import baseConfig from './webpack.config.base';

const { host, port } = config.server;

export default {

    ...baseConfig,

    mode: 'development',
    devtool: 'cheap-module-eval-source-map',

    entry: {
        main: [
            `webpack-hot-middleware/client?path=http://${host}:${port}/__webpack_hmr`,
            'babel-polyfill',
            `${config.client}/index.js`,
        ],

        downloader: [
            'babel-polyfill',
            `${config.submodules}/downloader/viewport/index.js`,
        ]
    },

    output: {
        ...baseConfig.output,
        publicPath: `http://${host}:${port}/dist/`,
    },

    plugins: [
        // “If you are using the CLI, the webpack process will not exit with an error code by enabling this plugin.”
        // https://github.com/webpack/docs/wiki/list-of-plugins#noerrorsplugin
        new webpack.NoEmitOnErrorsPlugin(),

        // https://webpack.github.io/docs/hot-module-replacement-with-webpack.html
        new webpack.HotModuleReplacementPlugin(),
    ],

    // https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
    target: 'electron-renderer'
};
