
import path from 'path';
import config from './index';

export default {

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    'babel-loader',
                    'eslint-loader'
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.html/,
                use: 'html-loader',
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: 'url-loader'
            },
            {
                test: /\.(eot|woff|woff2|ttf)([?]?.*)$/,
                loader: [{
                    loader: 'url-loader',
                    options: {
                        name: 'fonts/[name].[ext]',
                    },
                }],
            },
            {
                test: /\.svg$/,
                use: ['svg-inline-loader'],
                include: path.resolve(__dirname, 'src'),
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: [{
                    loader: 'url-loader',
                    options: {
                        mimetype: 'image/svg+xml',
                    },
                }],
                include: /node_modules/,
            },
        ]
    },

    output: {
        path: config.dist,
        filename: '[name].js',

        // https://github.com/webpack/webpack/issues/1114
        libraryTarget: 'commonjs2'
    },

    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            root: path.join(config.client, '../'),
            config: path.join(config.client, '../config'),
            common: path.join(config.client, '../common'),
            app: path.join(config.client, './'),
            ui: path.join(config.client, 'js/ui/'),
            utils: path.join(config.client, 'js/utils/'),
            components: path.join(config.client, 'js/components/'),
            stores: path.join(config.client, 'js/stores/'),
        },
    },
};
