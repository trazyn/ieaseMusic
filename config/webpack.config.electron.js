
import webpack from 'webpack';
import MinifyPlugin from 'babel-minify-webpack-plugin';
import config from './index';
import baseConfig from './webpack.config.base';

export default {

    ...baseConfig,

    devtool: false,

    entry: [
        'babel-polyfill',
        `./main.js`,
    ],

    output: {
        path: config.dist,
        filename: 'main.js'
    },

    plugins: [
        // Minify the output
        new MinifyPlugin(),

        // NODE_ENV should be production so that modules do not perform certain development checks
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
    ],

    // https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
    target: 'electron-main',

    /**
     * Disables webpack processing of __dirname and __filename.
     * If you run the bundle in node.js it falls back to these values of node.js.
     * https://github.com/webpack/webpack/issues/2010
     */
    node: {
        __dirname: false,
        __filename: false
    }
};
