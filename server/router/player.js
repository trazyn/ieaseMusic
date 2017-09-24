
/* eslint-disable */
import express from 'express';
import apicache from 'apicache'
import axios from 'axios';
import _debug from 'debug';
/* eslint-enable */

const debug = _debug('dev:api');
const error = _debug('dev:error');
const router = express();
const cache = apicache.middleware;
const onlyStatus200 = (req, res) => res.statusCode === 200;

async function getRecentUser(id) {
    var users = [];

    try {
        // Get the recent user that played this song
        let response = await axios(`/simi/user?id=${id}`);

        if (response.data.code !== 200) {
            throw response.data;
        } else {
            response.data.userprofiles.map(e => {
                users.push({
                    id: e.userId,
                    name: e.nickname,
                    avatar: `${e.avatarUrl}?param=50y50`,
                    link: `/user/${e.userId}`,
                });
            });
        }
    } catch (ex) {
        error('Failed to get recent user: %O', ex);
    }

    return users;
}

async function getSimilarArtist(id) {
    var artists = [];

    try {
        let response = await axios.get(`/simi/artist?id=${id}`);

        if (response.data.code === 200) {
            response.data.artists.map(e => {
                artists.push({
                    id: e.id,
                    name: e.name,
                    avatar: `${e.picUrl}?param=50y50`,
                    // Broken link
                    link: e.id ? `/artist/${e.id}` : '',
                });
            });
        } else {
            throw response.data;
        }
    } catch (ex) {
        error('Failed to get similar artist: %O', ex);
    }

    return artists;
}

async function getSimilarPlaylist(id) {
    var playlists = [];

    try {
        let response = await axios.get(`/simi/playlist?id=${id}`);

        if (response.data.code !== 200) {
            throw response.data;
        } else {
            response.data.playlists.map(e => {
                playlists.push({
                    id: e.id,
                    name: e.name,
                    cover: e.coverImgUrl,
                    link: `/player/0/${e.id}`,
                });
            });
        }
    } catch (ex) {
        error('Failed to get similar playlist: %O', ex);
    }

    return playlists;
}

async function getAlbumBySong(id) {
    var albums = [];

    try {
        let response = await axios.get(`/simi/song?id=${id}`);

        if (response.data.code !== 200) {
            throw response.data;
        } else {
            response.data.songs.map(e => {
                var album = e.album;

                albums.push({
                    id: album.id,
                    name: album.name,
                    cover: album.picUrl,
                    link: `/player/1/${album.id}`
                });
            });
        }
    } catch (ex) {
        error('Failed to get similar song: %O', ex);
    }

    return albums;
}

router.get('/song/:id', cache('5 minutes', onlyStatus200), async(req, res) => {
    debug('Handle request for /player/song');

    var id = req.params.id;
    var song = {};

    debug('Params \'id\': %s', id);

    try {
        let response = await axios.get(`/music/url?id=${id}`);
        let data = response.data;

        if (data.code !== 200) {
            throw data;
        }

        song = data.data[0];
        song = {
            id: song.id,
            src: song.url,
            md5: song.md5,
            bitRate: song.br,
        };
    } catch (ex) {
        error('Failed to get song URL: %O', ex);
    }

    res.send({
        song,
    });
});

router.get('/related/:songid/:artistid', cache('10 minutes', onlyStatus200), async(req, res) => {
    debug('Handle request for /player/related');

    var songid = req.params.songid;
    var artistid = req.params.artistid;

    debug('Params \'songid\': %s', songid);
    debug('Params \'artistid\': %s', artistid);

    var users = await getRecentUser(songid);
    var artists = await getSimilarArtist(artistid);

    var playlists = [
        ...(await getAlbumBySong(songid)),
        ...(await getSimilarPlaylist(songid))
    ];

    res.send({
        users,
        artists,
        playlists,
    });
});

router.get('/:type/:id', async(req, res) => {
    debug('Handle request for /player');

    /**
     * O: playlist
     * 1: album
     * */
    var type = +req.params.type;
    var id = req.params.id;
    var meta = {};
    var songs = [];

    debug('Params \'type\': %s', type);
    debug('Params \'id\': %s', id);

    try {
        let response = await axios.get(type === 0 ? '/playlist/detail' : '/album', {
            params: {
                id
            },
        });
        let data = response.data;

        if (data.code !== 200) {
            throw data;
        } else {
            songs = (data.songs || data.playlist.tracks).map(e => {
                // eslint-disable-next-line
                var { al /* Album */, ar /* Artist */ } = e;

                return {
                    id: e.id,
                    name: e.name,
                    duration: e.dt,
                    album: {
                        id: al.id,
                        name: al.name,
                        cover: `${al.picUrl}?param=y100y100`,
                        link: `/player/1/${al.id}`
                    },
                    artists: ar.map(e => ({
                        id: e.id,
                        name: e.name,
                        // Broken link
                        link: e.id ? `/artist/${e.id}` : '',
                    }))
                };
            });

            if (type === 0) {
                // User's playlist
                meta = data.playlist;

                meta = {
                    name: meta.name,
                    size: meta.trackCount,
                    cover: meta.coverImgUrl,
                    author: [{
                        id: meta.creator.userId,
                        name: meta.creator.nickname,
                        link: `/user/${meta.creator.userId}`,
                    }],
                    played: meta.playCount,
                    subscribed: meta.subscribed
                };
            } else {
                // Album
                meta = data.album;

                meta = {
                    name: meta.name,
                    size: meta.size,
                    cover: meta.picUrl,
                    author: meta.artists.map(e => ({
                        id: e.id,
                        name: e.name,
                        // Broken link
                        link: e.id ? `/artist/${e.id}` : '',
                    })),
                    company: meta.company,
                    subscribed: meta.info.liked,
                };
            }
        }
    } catch (ex) {
        error('Failed to get player songs: %O', ex);
    }

    res.send({
        meta: Object.assign({}, meta, { id, type }),
        songs,
    });
});

module.exports = router;
