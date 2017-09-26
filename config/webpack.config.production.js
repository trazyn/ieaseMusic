
import path from 'path';
import webpack from 'webpack';
import MinifyPlugin from 'babel-minify-webpack-plugin';
import config from './index';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import baseConfig from './webpack.config.base';

export default {

    ...baseConfig,

    devtool: false,

    entry: [
        'babel-polyfill',
        `${config.client}/app.js`,
    ],

    output: {
        path: config.dist,
        filename: 'app.[hash].js'
    },

    plugins: [
        // https://github.com/webpack/webpack/issues/2545
        // Use babel-minify-webpack-plugin minify code
        new MinifyPlugin(),

        // https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
        // https://github.com/webpack/webpack/issues/864
        new webpack.optimize.OccurrenceOrderPlugin(),

        // NODE_ENV should be production so that modules do not perform certain development checks
        new webpack.DefinePlugin({
            DEBUG: false,
            'process.env.NODE_ENV': JSON.stringify('production')
        }),

        new CopyWebpackPlugin([
            {
                from: `${config.assets}/**/*`,
                to: `${config.dist}`,
            },
            {
                from: path.resolve(__dirname, '../package.json'),
                to: config.dist,
            },
        ]),

        new HtmlWebpackPlugin({
            filename: `${config.dist}/src/index.html`,
            template: './src/index.html',
            inject: 'body',
            hash: true,
            minify: {
                collapseWhitespace: true
            }
        })
    ],

    // https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
    target: 'electron-renderer'
};
