
import express from 'express';
import axios from 'axios';
import _debug from 'debug';

const debug = _debug('dev:api');
const error = _debug('dev:error');
const router = express();

async function getArtist(id) {
    var profile = {};
    var songs = [];

    try {
        let response = await axios.get(`/artists?id=${id}`);
        let data = response.data;

        if (data.code !== 200) {
            throw data;
        } else {
            profile = data.artist;

            profile = {
                id: profile.id,
                uid: profile.accountId,
                name: profile.name,
                background: profile.picUrl + '?param=640y300',
                followed: profile.followed,
                size: {
                    song: profile.musicSize,
                    mv: profile.mvSize,
                    album: profile.albumSize,
                },
            };
            songs = data.hotSongs;
        }
    } catch (ex) {
        error('Failed to get artist: %O', ex);
    }

    return { profile, songs };
}

async function getAlbums(id) {
    var albums = [];

    try {
        let response = await axios.get(`/artist/album?id=${id}&limit=999`);
        let data = response.data;

        if (data.code !== 200) {
            throw data;
        } else {
            albums = data.hotAlbums.map(e => ({
                id: e.id,
                name: e.name,
                cover: e.picUrl,
                link: `/player/1/${e.id}`
            }));
        }
    } catch (ex) {
        error('Failed to get albums: %O', ex);
    }

    return albums;
}

async function getSimilar(id) {
    var similar = [];

    try {
        let response = await axios.get(`/simi/artist?id=${id}`);
        let data = response.data;

        if (data.code !== 200) {
            throw data;
        } else {
            similar = data.artists.map(e => ({
                id: e.id,
                name: e.name,
                avatar: e.picUrl,
                publishTime: e.publishTime,
                link: `/artist/${e.id}`,
            }));
        }
    } catch (ex) {
        error('Failed to get similar artists: %O', ex);
    }

    return similar;
}

router.get('/:id', async(req, res) => {
    debug('Handle request for /artist');

    var id = req.params.id;

    debug('Params \'id\': %s', id);

    res.send({
        ...(await getArtist(id)),

        albums: await getAlbums(id),
        similar: await getSimilar(id),
    });
});

module.exports = router;
