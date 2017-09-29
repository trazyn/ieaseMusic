
import path from 'path';

const config = {
    server: {
        port: process.env.PORT || 3001,
        host: 'localhost'
    },

    api: {
        port: process.env.API_PORT || 10086,
    },

    client: path.resolve(__dirname, '../src'),
    assets: path.resolve(__dirname, '../src/assets'),
    dist: path.resolve(__dirname, '../dist'),
};

export default config;
