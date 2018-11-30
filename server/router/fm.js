
import express from 'express';
import axios from 'axios';
import _debug from 'debug';

const debug = _debug('dev:api');
const error = _debug('dev:error');
const router = express();

async function getPlaylist() {
    let response = await axios.get(`/personal_fm`);
    let data = response.data;
    var songs = [];

    if (data.code !== 200) {
        throw data;
    }

    songs = data.data || [];

    if (songs.length === 0) {
        return getPlaylist();
    }

    return songs;
}

router.get('/', async(req, res) => {
    debug('Handle request for /fm');

    let songs = [];

    try {
        songs = await getPlaylist();
    } catch (ex) {
        error('Failed to get FM: %O', ex);
    }

    res.send({
        id: 'PERSONAL_FM',
        name: 'Made For You',
        link: '/fm',
        size: songs.length,
        songs: songs.map(e => {
            var { album, artists } = e;

            return {
                id: e.id.toString(),
                name: e.name,
                duration: e.duration,
                album: {
                    id: album.id.toString(),
                    name: album.name,
                    cover: album.picUrl,
                    link: `/player/1/${album.id}`,
                },
                artists: artists.map(e => ({
                    id: e.id.toString(),
                    name: e.name,
                    // Broken link
                    link: e.id ? `/artist/${e.id}` : '',
                }))
            };
        }),
    });
});

module.exports = router;
