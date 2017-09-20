
import express from 'express';
import axios from 'axios';
import _debug from 'debug';

const debug = _debug('dev:api');
const error = _debug('dev:error');
const router = express();

async function getRecentUser(id) {
    // Get the recent user that played this song
    var response = await axios(`/simi/user?id=${id}`);
    var users = [];

    if (response.data.code !== 200) {
        error('Failed to get recent user: %O', response.data);
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

    return users;
}

async function getSimilarArtist(id) {
    var response = await axios.get(`/simi/artist?id=${id}`);
    var artists = [];

    if (response.data.code === 200) {
        response.data.artists.map(e => {
            artists.push({
                id: e.id,
                name: e.name,
                avatar: `${e.picUrl}?param=50y50`,
                link: `/artist/${e.id}`,
            });
        });
    } else {
        error('Failed to get similar artist: %O', response.data);
    }

    return artists;
}

async function getSimilarPlaylist(id) {
    var response = await axios.get(`/simi/playlist?id=${id}`);
    var playlists = [];

    if (response.data.code !== 200) {
        error('Failed to get similar playlist: %O', response.data);
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

    return playlists;
}

async function getAlbumBySong(id) {
    var response = await axios.get(`/simi/song?id=${id}`);
    var albums = [];

    if (response.data.code !== 200) {
        error('Failed to get similar song: %O', response.data);
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

    return albums;
}

router.get('/:type/:id', async(req, res) => {
    debug('Handle request for /player');

    /**
     * O: playlist
     * 1: album
     * */
    var type = +req.params.type;
    var id = req.params.id;

    debug('Params \'type\': %s', type);
    debug('Params \'id\': %s', id);

    var response = await axios.get(type === 0 ? '/playlist/detail' : '/album', {
        params: {
            id
        },
    });
    var data = response.data;
    var meta = {};
    var songs = [];

    if (data.code !== 200) {
        debug('Failed to get player songs: %O', data);
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
                    link: `/artist/${e.id}`,
                }))
            };
        });

        if (type === 0) {
            // User's playlist
            meta = data.playlist;

            meta = {
                name: meta.name,
                size: meta.trackCount,
                cover: `${meta.coverImgUrl}?param=300y300`,
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
                cover: `${meta.picUrl}?param=300y300`,
                author: meta.artists.map(e => ({
                    id: e.id,
                    name: e.name,
                    link: `/artist/${e.id}`,
                })),
                company: meta.company,
                subscribed: meta.info.liked,
            };
        }
    }

    res.send({
        id,
        type,
        meta,
        songs,
    });
});

router.get('/related/:songid/:artistid', async(req, res) => {
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

module.exports = router;
