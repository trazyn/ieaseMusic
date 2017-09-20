
import express from 'express';
import axios from 'axios';
import _debug from 'debug';

const debug = _debug('dev:api');
const error = _debug('dev:error');
const router = express();

router.get('/:type?', async(req, res) => {
    debug('Handle request for /playlist');

    var type = req.params.type || '全部';

    debug('Params \'type\': %s', type);

    var response = await axios.get('/top/playlist/highquality', {
        params: {
            cat: type,
            limit: 999,
            offset: 0,
        },
    });
    var playlists = [];

    if (response.data.code !== 200) {
        error('Failed to get playlist \'%s\': %O', type, response.data);
    } else {
        response.data.playlists.map(e => {
            var creator = e.creator;

            playlists.push({
                id: e.id,
                name: e.name,
                played: e.playCount,
                size: e.trackCount,
                link: `/player/0/${e.id}`,
                cover: `${e.coverImgUrl}?param=100y100`,
                user: {
                    id: creator.userId,
                    name: creator.nickname,
                    link: `/user/${creator.userId}`,
                },
            });
        });
    }

    res.send({
        playlists,
    });
});

module.exports = router;
