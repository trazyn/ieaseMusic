
import express from 'express';
import axios from 'axios';
import _debug from 'debug';

const debug = _debug('dev:api');
const error = _debug('dev:error');
const router = express();

router.get('/:id', async(req, res) => {
    debug('Handle request for /user');

    var id = req.params.id;

    debug('Params \'id\': %s', id);

    var user = await axios.get(`/user/detail?uid=${id}`);
    var playlists = await axios.get(`/user/playlist?uid=${id}`);

    if (false
        || user.data.code !== 200
        || playlists.data.code !== 200) {
        error('Failed to get user info: %O, %O', user.data, playlists.data);

        user = {};
        playlists = [];
    } else {
        user = user.data.profile;
        playlists = playlists.data.playlist;
    }

    res.send({
        profile: {
            id: user.userId,
            name: user.nickname,
            signature: user.signature,
            avatar: user.avatarUrl,
            followed: user.followed,
            followers: user.followeds,
        },
        playlists: playlists.map(e => ({
            id: e.id,
            name: e.name,
            cover: e.coverImgUrl,
            played: e.playCount,
            size: e.trackCount,
            link: `/player/0/${e.id}`
        })),
    });
});

module.exports = router;
