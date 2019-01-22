
import path from 'path';
import webpack from 'webpack';
import MinifyPlugin from 'terser-webpack-plugin';
import config from './index';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import baseConfig from './webpack.config.base';

export default {

    ...baseConfig,

    mode: 'production',
    devtool: false,

    entry: {
        main: [
            'babel-polyfill',
            `${config.client}/index.js`,
        ],

        downloader: [
            'babel-polyfill',
            `${config.submodules}/downloader/viewport/index.js`,
        ]
    },

    output: {
        path: config.dist,
        filename: '[name].[hash].js'
    },

    plugins: [
        // https://github.com/webpack/webpack/issues/2545
        // Use babel-minify-webpack-plugin minify code
        new MinifyPlugin(),

        // https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
        // https://github.com/webpack/webpack/issues/864
        new webpack.optimize.OccurrenceOrderPlugin(),

        new CopyWebpackPlugin([
            {
                from: `${config.assets}/**/*`,
                to: `${config.dist}`,
            },
            {
                from: `${path.resolve(__dirname, '../NeteaseCloudMusicApi')}/module/*`,
                to: config.dist,
            },
            {
                from: `${path.resolve(__dirname, '../NeteaseCloudMusicApi')}/util/*`,
                to: config.dist,
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
            minify: true,
            chunks: ['main']
        }),

        new HtmlWebpackPlugin({
            filename: `${config.dist}/src/downloader.html`,
            template: './submodules/downloader/viewport/index.html',
            inject: 'body',
            hash: true,
            minify: true,
            chunks: ['downloader']
        })
    ],

    // https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
    target: 'electron-renderer'
};
