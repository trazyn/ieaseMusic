
/* eslint-disable */
import express from 'express';
import apicache from 'apicache'
import axios from 'axios';
import _debug from 'debug';
import search from '../search';
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
                    id: e.userId.toString(),
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
                    id: e.id.toString(),
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
                    id: e.id.toString(),
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
                    id: album.id.toString(),
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

async function getFlac(name, artists) {
    var response = await axios.get('http://sug.music.baidu.com/info/suggestion', {
        params: {
            word: name,
            version: 2,
            from: 0,
        }
    });
    var songs = response.data.data.song;
    var song = songs.find(e => artists.indexOf(e.artistname) > -1);

    if (!song) {
        return false;
    }
    response = await axios.get('http://music.baidu.com/data/music/fmlink', {
        params: {
            songIds: song.songid,
            type: 'flac',
        },
    });

    debug('FLAC: %O', response.data.data.songList);
    return response.data.data.songList[0].songLink;
}

router.get('/subscribe/:id', async(req, res) => {
    debug('Handle request for /player/subscribe');

    var id = req.params.id;
    var success = false;

    debug('Params \'id\': %s', id);

    try {
        let response = await axios.get(`/subscribe/?id=${id}`);
        let data = response.data;

        success = data.code === 200;

        if (data.code !== 200) {
            throw data;
        }
    } catch (ex) {
        error('Failed to subscribe playlist: %O', ex);
    }

    res.send({
        success,
    });
});

router.get('/unsubscribe/:id', async(req, res) => {
    debug('Handle request for /player/unsubscribe');

    var id = req.params.id;
    var success = false;

    debug('Params \'id\': %s', id);

    try {
        let response = await axios.get(`/unsubscribe/?id=${id}`);
        let data = response.data;

        success = data.code === 200;

        if (data.code !== 200) {
            throw data;
        }
    } catch (ex) {
        error('Failed to unsubscribe playlist: %O', ex);
    }

    res.send({
        success,
    });
});

router.get('/song/:id/:name/:artists/:flac?', cache('3 minutes', onlyStatus200), async(req, res) => {
    debug('Handle request for /player/song');

    var id = req.params.id;
    var name = req.params.name;
    var artists = req.params.artists;
    var flac = req.params.flac || 0;
    var song = {};

    debug('Params \'id\': %s, \'name\': %s, \'artists\': %s, \'flac\': %s', id, name, artists, flac);

    try {
        if (+flac) {
            let src = await getFlac(name, artists);

            if (src) {
                res.send({
                    song: {
                        src,
                        isFlac: true,
                    }
                });

                return;
            }
        }
    } catch (ex) {
        debug('Failed to get flac file: %O', ex);
    }

    try {
        let response = await axios.get(`/music/url?id=${id}`);
        let data = response.data;

        if (data.code !== 200) {
            throw data;
        }

        song = data.data[0];
        song = {
            id: song.id.toString(),
            src: song.url,
            md5: song.md5,
            bitRate: song.br,
        };

        if (!song.src) {
            throw new Error('No Copyright');
        }
    } catch (ex) {
        try {
            // Search from other source
            debug('Search: %s, %s', name, artists);
            song = await search(name, artists);
        } catch (ex) {
            error('Failed to get song URL: %O', ex);
        }
    }

    debug('Resolve song: %O', song);

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

            if (type === 0) {
                // User's playlist
                meta = data.playlist;

                meta = {
                    name: meta.name,
                    size: meta.trackCount,
                    cover: meta.coverImgUrl,
                    author: [{
                        id: meta.creator.userId.toString(),
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
                        id: e.id.toString(),
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
