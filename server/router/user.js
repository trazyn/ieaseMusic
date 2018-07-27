
import express from 'express';
import axios from 'axios';
import rp from 'request-promise-native';
import url from 'url';
import _debug from 'debug';

const debug = _debug('dev:api');
const error = _debug('dev:error');
const router = express();

async function getUser(id) {
    var user = {};

    try {
        let response = await axios.get(`/user/detail?uid=${id}`);
        let data = response.data;

        if (data.code !== 200) {
            throw data;
        } else {
            user = data.profile;

            user = {
                id: user.userId.toString(),
                name: user.nickname,
                signature: user.signature,
                avatar: user.avatarUrl,
                followed: user.followed,
                followers: user.followeds,
            };
        }
    } catch (ex) {
        error('Failed to get user: %O', ex);
    }

    return user;
}

async function getPlaylist(id) {
    var list = [];

    try {
        let response = await axios.get(`/user/playlist?uid=${id}`);
        let data = response.data;

        if (data.code !== 200) {
            throw data;
        } else {
            list = data.playlist.map(e => ({
                id: e.id.toString(),
                name: e.name,
                cover: e.coverImgUrl,
                played: e.playCount,
                size: e.trackCount,
                link: `/player/0/${e.id}`
            }));
        }
    } catch (ex) {
        error('Failed to get playlist: %O', ex);
    }

    return list;
}

router.get('/:id', async(req, res) => {
    debug('Handle request for /user');

    var id = req.params.id;

    debug('Params \'id\': %s', id);

    res.send({
        profile: await getUser(id),
        playlists: await getPlaylist(id),
    });
});

router.get('/unfollow/:id', async(req, res) => {
    debug('Handle request for /user/unfollow');

    var id = req.params.id;
    var success = false;

    debug('Params \'id\': %s', id);

    try {
        let response = await axios.get(`/unfollow/?id=${id}`);
        let data = response.data;

        success = data.code === 200;

        if (data.code !== 200) {
            throw data;
        }
    } catch (ex) {
        error('Failed to unfollow user: %O', ex);
    }

    res.send({
        success,
    });
});

router.get('/follow/:id', async(req, res) => {
    debug('Handle request for /user/follow');

    var id = req.params.id;
    var success = false;

    debug('Params \'id\': %s', id);

    try {
        let response = await axios.get(`/follow/?id=${id}`);
        let data = response.data;

        success = data.code === 200;

        if (data.code !== 200) {
            throw data;
        }
    } catch (ex) {
        error('Failed to follow user: %O', ex);
    }

    res.send({
        success,
    });
});

router.get('/login/qrcode', async(req, res) => {
    debug('Handle request for /user/login/qrcode');

    try {
        rp.get({
            uri: 'https://music.163.com/api/sns/authorize?snsType=10&clientType=web2&callbackType=Login&forcelogin=true',
            resolveWithFullResponse: true,
        })
            .then(response => {
                let matched = response.body.match(/(\/connect\/qrcode\/[\w-_]+)/);
                let q = url.parse(response.request.href, true);

                if (!matched) {
                    throw Error('Failed to get QRCode.');
                } else {
                    let uuid = matched[1].split('/')[3];
                    res.send({
                        qrcode: `${q.protocol}//${q.hostname}${matched[1]}`,
                        polling: `${q.protocol}//long.${q.hostname}/connect/l/qrconnect?uuid=${uuid}`,
                        state: q.query.state,
                    });
                }
            });
    } catch (ex) {
        error('Failed to get QRCode: %O', ex);
        res.send({
            success: false,
        });
    }
});

router.get('/login/qrcode/:code/:state', async(req, res) => {
    debug('Handle request for /user/login/qrcode/dologin');

    var code = req.params.code;
    var state = req.params.state;

    debug('Params \'code\': %s', code);
    debug('Params \'state\': %s', state);

    try {
        rp.get({
            uri: 'https://music.163.com/back/weichat',
            qs: {
                code,
                state
            },
            jar: true,
            json: true,
            resolveWithFullResponse: true,
        })
            .then(response => {
                var cookies = response.request.headers.cookie;

                if (cookies) {
                    cookies.split(';').map(
                        e => {
                            var kv = e.trim().split('=');

                            res.cookie(kv[0], kv[1]);
                        }
                    );
                    res.send(response.body);
                }

                throw Error('No Cookie.');
            });
    } catch (ex) {
        error('Failed to login via QRCode: %O', ex);
        res.send({
            success: false,
        });
    }
});

module.exports = router;
