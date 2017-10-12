
import express from 'express';
import axios from 'axios';
import _debug from 'debug';

const debug = _debug('dev:api');
const error = _debug('dev:error');
const router = express();
const limit = 50;

router.get('/:type?/:offset?', async(req, res) => {
    debug('Handle request for /playlist');

    var playlists = [];
    var type = req.params.type || '全部';
    var offset = +req.params.offset || 0;
    var nextHref = '';

    debug('Params \'type\': %s', type);

    try {
        let response = await axios.get('/top/playlist', {
            params: {
                cat: type,
                limit,
                offset,
                order: 'hot',
            },
        });
        let data = response.data;

        if (data.code !== 200) {
            throw data;
        } else {
            data.playlists.map(e => {
                var creator = e.creator;

                playlists.push({
                    id: e.id.toString(),
                    name: e.name,
                    played: e.playCount,
                    size: e.trackCount,
                    link: `/player/0/${e.id}`,
                    cover: `${e.coverImgUrl}?param=100y100`,
                    user: {
                        id: creator.userId.toString(),
                        name: creator.nickname,
                        link: `/user/${creator.userId}`,
                    },
                });
            });
        }

        if (data.more) {
            offset += limit;
            nextHref = `/api/playlist/${type}/${offset}`;
        }
    } catch (ex) {
        error('Failed to get playlist: %O', ex);
    }

    res.send({
        playlists,
        nextHref,
    });
});

module.exports = router;
