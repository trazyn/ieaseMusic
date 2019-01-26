
import express from 'express';
import axios from 'axios';
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
                following: user.follows,
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
        let response = await axios.get(`/follow/?id=${id}&&t=0`);
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
        let response = await axios.get(`/follow/?id=${id}&&t=1`);
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

module.exports = router;
