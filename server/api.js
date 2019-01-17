
/* eslint-disable */
import fs from 'fs';
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import apicache from 'apicache'
import axios from 'axios';
/* eslint-enable */

const app = express();
const cache = apicache.middleware;
const onlyStatus200 = (req, res) => res.statusCode === 200;
const port = process.env.API_PORT || 8000;
const special = {
    'daily_signin.js': '/daily_signin',
    'fm_trash.js': '/fm_trash',
    'personal_fm.js': '/personal_fm'
};
const apisDir = '../NeteaseCloudMusicApi/module';

app.use(cookieParser());

axios.defaults.baseURL = `http://localhost:${port}`;

// Set cookie for axios
app.use((req, res, next) => {
    axios.defaults.headers = req.headers;
    next();
});

fs.readdirSync(path.join(__dirname, apisDir)).reverse().forEach(file => {
    if (!/\.js$/i.test(file)) {
        return;
    }
    let route = (file in special) ? special[file] : '/' + file.replace(/\.js$/i, '').replace(/_/g, '/');
    let question = require(path.join(__dirname, apisDir, file));
    let request = require(`../NeteaseCloudMusicApi/util/request`);

    app.use(route, (req, res) => {
        let query = Object.assign({}, req.query, req.body, { cookie: req.cookies });
        question(query, request)
            .then(answer => {
                console.log('[OK]', decodeURIComponent(req.originalUrl));
                res.append('Set-Cookie', answer.cookie);
                res.status(answer.status).send(answer.body);
            })
            .catch(answer => {
                console.log('[ERR]', decodeURIComponent(req.originalUrl));
                if (answer.body.code === 301) {
                    answer.status = 200;
                }
                res.append('Set-Cookie', answer.cookie);
                res.status(answer.status).send(answer.body);
            });
    });
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

if (process.env.APIONLY) {
    console.log(`API Server run with port: ${port}`);
    app.listen(port);
}

export default app;
