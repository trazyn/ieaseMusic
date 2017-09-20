
import express from 'express';
import axios from 'axios';
import _debug from 'debug';

const debug = _debug('dev:api');
const error = _debug('dev:error');
const router = express();

router.get('/', async(req, res) => {
    debug('Handle request for /fm');

    var response = await axios.get(`/personal_fm`);
    var data = response.data;

    if (data.code !== 200) {
        error('Failed to get FM: %O', data);
    }

    res.send({
        songs: (data.data || []).map(e => {
            var { album, artists } = e;

            return {
                id: e.id,
                name: e.name,
                duration: e.dt,
                album: {
                    id: album.id,
                    name: album.name,
                    cover: album.picUrl,
                    link: `/player/1/${album.id}`,
                },
                artists: artists.map(e => ({
                    id: e.id,
                    name: e.name,
                    link: `/artist/${e.id}`,
                }))
            };
        }),
    });
});

module.exports = router;
