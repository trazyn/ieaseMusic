
import MinifyPlugin from 'uglifyjs-webpack-plugin';
import config from './index';
import baseConfig from './webpack.config.base';

export default {

    ...baseConfig,

    mode: 'production',
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
