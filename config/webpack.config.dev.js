
import webpack from 'webpack';
import config from './index';
import baseConfig from './webpack.config.base';

const { host, port } = config.server;

export default {

    ...baseConfig,

    devtool: 'cheap-module-eval-source-map',

    entry: [
        `webpack-hot-middleware/client?path=http://${host}:${port}/__webpack_hmr`,
        'babel-polyfill',
        `${config.client}/app.js`,
    ],

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

        // NODE_ENV should be production so that modules do not perform certain development checks
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
    ],

    // https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
    target: 'electron-renderer'
};
