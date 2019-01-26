
/* eslint-disable */
import fs from 'fs';
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import apicache from 'apicache'
import bodyParser from 'body-parser';
import axios from 'axios';
/* eslint-enable */

const app = express();
const cache = apicache.middleware;
const onlyStatus200 = (req, res) => res.statusCode === 200;
const port = process.env.API_PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

axios.defaults.baseURL = `http://localhost:${port}`;

// Set cookie for axios
app.use((req, res, next) => {
    axios.defaults.headers = req.headers;
    next();
});

function isDev() {
    return process.mainModule.filename.indexOf('app.asar') === -1;
}

function mount(proxy) {
    let special = {
        'daily_signin.js': '/daily_signin',
        'fm_trash.js': '/fm_trash',
        'personal_fm.js': '/personal_fm'
    };

    fs.readdirSync(path.join(__dirname, `${isDev() ? '..' : '.'}/NeteaseCloudMusicApi/module`)).reverse().forEach(file => {
        if (!/\.js$/i.test(file)) {
            return;
        }

        try {
            // https://stackoverflow.com/questions/42797313/webpack-dynamic-module-loader-by-require
            let route = (file in special) ? special[file] : '/' + file.replace(/\.js$/i, '').replace(/_/g, '/');
            let question = require('../NeteaseCloudMusicApi/module/' + file);
            let request = require('../NeteaseCloudMusicApi/util/request');

            app.use(route, (req, res) => {
                let query = Object.assign({}, req.query, req.body, { cookie: req.cookies }, { proxy });
                question(query, request)
                    .then(answer => {
                        res.append('Set-Cookie', answer.cookie);
                        res.status(answer.status).send(answer.body);
                    })
                    .catch(answer => {
                        if (1
                            && answer.body
                            && answer.body.code
                            && answer.status !== 200
                        ) {
                            answer.status = 200;
                        }
                        res.append('Set-Cookie', answer.cookie);
                        res.status(answer.status).send(answer.body);
                    });
            });
        } catch (ex) {
            console.error(ex);
        }
    });

    app.use('/api/home', require('./router/home'));
    app.use('/api/player', require('./router/player'));
    app.use('/api/user', require('./router/user'));
    app.use('/api/artist', require('./router/artist'));
    app.use('/api/top', cache('1 hour', onlyStatus200), require('./router/top'));
    app.use('/api/playlist', cache('10 minutes', onlyStatus200), require('./router/playlist'));
    app.use('/api/fm', require('./router/fm'));
    app.use('/api/search', require('./router/search'));
    app.use('/api/comments', require('./router/comments'));
    app.use('/api/lyrics', cache('360 minutes'), require('./router/lyrics'));
    app.use('/api/qrcode', require('./router/qrcode'));
}

if (process.env.APIONLY) {
    mount();
    console.log(`API Server run with port: ${port}`);
}

export default (port, proxy, callback) => {
    mount(proxy);
    app.listen(port, callback);
};
