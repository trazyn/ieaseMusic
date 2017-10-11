
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
                id: profile.id.toString(),
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
            songs = data.hotSongs.map(e => {
                // eslint-disable-next-line
                var { al /* Album */, ar /* Artist */ } = e;

                return {
                    id: e.id.toString(),
                    name: e.name,
                    duration: e.dt,
                    album: {
                        id: al.id.toString(),
                        name: al.name,
                        cover: `${al.picUrl}?param=y100y100`,
                        link: `/player/1/${al.id}`
                    },
                    artists: ar.map(e => ({
                        id: e.id.toString(),
                        name: e.name,
                        // Broken link
                        link: e.id ? `/artist/${e.id}` : '',
                    }))
                };
            });
        }
    } catch (ex) {
        error('Failed to get artist: %O', ex);
    }

    return {
        profile,
        playlist: {
            id: profile.id.toString(),
            name: `TOP 50 - ${profile.name}`,
            size: 50,
            songs,
        }
    };
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
                id: e.id.toString(),
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
                id: e.id.toString(),
                name: e.name,
                avatar: e.picUrl,
                publishTime: e.publishTime,
                // Broken link
                link: e.id ? `/artist/${e.id}` : '',
            }));
        }
    } catch (ex) {
        error('Failed to get similar artists: %O', ex);
    }

    return similar;
}

router.get('/unfollow/:id', async(req, res) => {
    debug('Handle request for /artist/unfollow');

    var id = req.params.id;
    var success = false;

    debug('Params \'id\': %s', id);

    try {
        let response = await axios.get(`/unsub/?id=${id}`);
        let data = response.data;

        success = data.code === 200;

        if (data.code !== 200) {
            throw data;
        }
    } catch (ex) {
        error('Failed to unfollow artist: %O', ex);
    }

    res.send({
        success,
    });
});

router.get('/follow/:id', async(req, res) => {
    debug('Handle request for /artist/follow');

    var id = req.params.id;
    var success = false;

    debug('Params \'id\': %s', id);

    try {
        let response = await axios.get(`/sub/?id=${id}`);
        let data = response.data;

        success = data.code === 200;

        if (data.code !== 200) {
            throw data;
        }
    } catch (ex) {
        error('Failed to follow artist: %O', ex);
    }

    res.send({
        success,
    });
});

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
