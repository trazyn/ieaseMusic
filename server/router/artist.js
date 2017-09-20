
import express from 'express';
import axios from 'axios';
import _debug from 'debug';

const debug = _debug('dev:api');
const error = _debug('dev:error');
const router = express();

router.get('/:id', async(req, res) => {
    debug('Handle request for /artist');

    var id = req.params.id;

    debug('Params \'id\': %s', id);

    var songs = [];
    var artist = await axios.get(`/artists?id=${id}`);
    var albums = await axios.get(`/artist/album?id=${id}&limit=999`);
    var similar = await axios.get(`/simi/artist?id=${id}`);

    if (false
        || artist.data.code !== 200
        || albums.data.code !== 200
        || similar.data.code !== 200) {
        error('Failed to get artist info: %O, %O', artist.data, albums.data, similar.data);

        artist = {};
        songs = [];
        albums = [];
        similar = [];
    } else {
        songs = artist.data.hotSongs;
        artist = artist.data.artist;
        albums = albums.data.hotAlbums;
        similar = similar.data.artists;
    }

    res.send({
        profile: {
            id: artist.id,
            uid: artist.accountId,
            name: artist.name,
            background: artist.picUrl + '?param=640y300',
            followed: artist.followed,
            size: {
                song: artist.musicSize,
                mv: artist.mvSize,
                album: artist.albumSize,
            },
        },
        songs,
        albums: albums.map(e => ({
            id: e.id,
            name: e.name,
            cover: e.picUrl,
            link: `/player/1/${e.id}`
        })),
        similar: similar.map(e => ({
            id: e.id,
            name: e.name,
            avatar: e.picUrl,
            publishTime: e.publishTime,
            link: `/artist/${e.id}`,
        })),
    });
});

module.exports = router;
