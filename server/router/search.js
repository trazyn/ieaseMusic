
import express from 'express';
import axios from 'axios';
import _debug from 'debug';

const debug = _debug('dev:api');
const error = _debug('dev:error');
const router = express();

async function getPlaylists(keywords, offset = 0) {
    var playlists = [];

    try {
        let response = await axios.get('/search', {
            params: {
                offset,
                keywords,
                limit: 30,
                type: 1000,
            }
        });
        let data = response.data;

        if (data.code !== 200) {
            throw data;
        } else {
            data.result.playlists.map(e => {
                var creator = e.creator;

                playlists.push({
                    id: e.id.toString(),
                    name: e.name,
                    cover: e.coverImgUrl,
                    played: e.playCount,
                    star: e.bookCount,
                    size: e.trackCount,
                    link: `/player/0/${e.id}`,
                    creator: {
                        id: creator.id,
                        name: creator.name,
                        link: `/user/${creator.id}`,
                    },
                });
            });
        }
    } catch (ex) {
        error('Failed to search playlist: %O', ex);
    }

    return {
        playlists,
        nextHref: playlists.length === 30 ? `/api/search/1000/${offset + 30}/${keywords}` : '',
    };
}

async function getAlbums(keywords, offset = 0) {
    var albums = [];

    try {
        let response = await axios.get('/search', {
            params: {
                offset,
                keywords,
                limit: 30,
                type: 10,
            }
        });
        let data = response.data;

        if (data.code !== 200) {
            throw data;
        } else {
            data.result.albums.map(e => {
                var artist = e.artist;

                albums.push({
                    id: e.id.toString(),
                    name: e.name,
                    cover: e.picUrl,
                    publish: e.publishTime,
                    size: e.size,
                    link: `/player/1/${e.id}`,
                    artist: {
                        id: artist.id,
                        name: artist.name,
                        link: `/artist/${artist.id}`,
                    },
                });
            });
        }
    } catch (ex) {
        error('Failed to search albums: %O', ex);
    }

    return {
        albums,
        nextHref: albums.length === 30 ? `/api/search/10/${offset + 30}/${keywords}` : '',
    };
}

async function getArtists(keywords, offset = 0) {
    var artists = [];

    try {
        let response = await axios.get('/search', {
            params: {
                offset,
                keywords,
                limit: 30,
                type: 100,
            }
        });
        let data = response.data;

        if (data.code !== 200) {
            throw data;
        } else {
            data.result.artists.map(e => {
                artists.push({
                    id: e.id.toString(),
                    name: e.name,
                    avatar: e.picUrl || 'http://p3.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg?param=100y100',
                    followed: e.followed,
                    size: e.albumSize,
                    link: `/artist/${e.id}`,
                });
            });
        }
    } catch (ex) {
        error('Failed to search artists: %O', ex);
    }

    return {
        artists,
        nextHref: artists.length === 30 ? `/api/search/100/${offset + 30}/${keywords}` : '',
    };
}

async function getUsers(keywords, offset = 0) {
    var users = [];

    try {
        let response = await axios.get('/search', {
            params: {
                offset,
                keywords,
                limit: 30,
                type: 1002,
            }
        });
        let data = response.data;

        if (data.code !== 200) {
            throw data;
        } else {
            data.result.userprofiles.map(e => {
                users.push({
                    id: e.userId.toString(),
                    name: e.nickname,
                    avatar: e.avatarUrl,
                    link: `/user/${e.userId}`,
                });
            });
        }
    } catch (ex) {
        error('Failed to search users: %O', ex);
    }

    return {
        users,
        nextHref: users.length === 30 ? `/api/search/1002/${offset + 30}/${keywords}` : '',
    };
}

/**
Search type

10: 专辑
100: 歌手
1000: 歌单
1002: 用户
1004: MV
1006: 歌词
1009: 电台
* */
router.get('/:type/:offset/:keyword', async(req, res) => {
    debug('Handle request for /search');

    var type = req.params.type;
    var keyword = req.params.keyword;
    var offset = +req.params.offset;
    var data = {};

    debug('Params \'type\': %s, \'keyword\': %s, \'offset\': %s', type, keyword, offset);

    switch (type.toString()) {
        // Get playlists
        case '1000':
            data = await getPlaylists(keyword, offset);
            break;

        // Get albums
        case '10':
            data = await getAlbums(keyword, offset);
            break;

        // Get artists
        case '100':
            data = await getArtists(keyword, offset);
            break;

        // Get users
        case '1002':
            data = await getUsers(keyword, offset);
            break;
    }

    res.send(data);
});

module.exports = router;
