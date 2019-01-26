import express from 'express';
import axios from 'axios';
import uuid from 'uuid';
import _debug from 'debug';

const debug = _debug('dev:api');
const error = _debug('dev:error');
const router = express();

async function getNewest() {
    var list = [];

    try {
        let response = await axios.get('/album/newest');

        if (response.data.code !== 200) {
            throw response.data;
        } else {
            response.data.albums.map(e => {
                list.push({
                    id: e.id.toString(),
                    type: 1,
                    name: e.name,
                    size: e.size,
                    cover: `${e.picUrl}?param=130y130`,
                    background: `${e.artist.picUrl}?param=640y300`,
                    link: `/player/1/${e.id}`,
                });
            });
        }
    } catch (ex) {
        error('Failed to get hot album: %O', ex);
    }

    return list;
}

async function getPersonalized() {
    var list = [];

    try {
        let response = await axios.get('/personalized');

        if (response.data.code !== 200) {
            throw response.data;
        } else {
            response.data.result.map(e => {
                list.push({
                    id: e.id.toString(),
                    type: 0,
                    name: e.name,
                    played: e.playCount,
                    cover: `${e.picUrl}?param=130y130`,
                    background: `${e.picUrl}?param=500y500`,
                    link: `/player/0/${e.id}`
                });
            });
        }
    } catch (ex) {
        error('Failed to get personalized: %O', ex);
    }

    return list;
}

async function getSongs(id) {
    var songs = [];

    try {
        let response = await axios.get(`/playlist/detail?id=${id}`);

        if (response.data.code === 200) {
            songs = response.data.playlist.tracks.map(e => {
                // eslint-disable-next-line
                var {al /* Album */, ar /* Artist */} = e;

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
        } else {
            throw response.data;
        }
    } catch (ex) {
        error('Failed to get songs %O', ex);
    }

    return songs;
}

async function getLiked(id) {
    var list = [];

    try {
        let response = await axios.get(`/user/playlist?uid=${id}`);

        if (response.data.code !== 200) {
            error('Failed to get liked: %O', response.data);
        } else {
            let liked = response.data.playlist[0];
            let songs = await getSongs(liked.id);

            list = [{
                id: liked.id.toString(),
                name: liked.name,
                size: liked.trackCount,
                updateTime: liked.updateTime,
                publishTime: liked.publishTime,
                link: `/player/0/${liked.id}`,
                cover: liked.coverImgUrl,
                background: liked.creator.backgroundUrl,
                songs,
            }];
        }
    } catch (ex) {
        error('Failed to get liked: %O', ex);
    }

    return list;
}

async function getDaily() {
    var list = [];

    try {
        let response = await axios.get('/recommend/songs');

        if (response.data.code !== 200) {
            throw response.data;
        } else {
            list = [{
                id: uuid.v4(),
                name: '每日推荐歌曲',
                size: response.data.recommend.length,
                songs: response.data.recommend.map(e => {
                    var { album, artists } = e;

                    return {
                        id: e.id.toString(),
                        name: e.name,
                        duration: e.duration,
                        album: {
                            id: album.id.toString(),
                            name: album.name,
                            cover: `${album.picUrl}?param=100y100`,
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
            }];

            let songs = list[0].songs;

            if (songs && songs.length) {
                list[0].cover = songs[0].album.cover;
            }
        }
    } catch (ex) {
        error('Failed to get daily songs: %O', ex);
    }

    return list;
}

async function getRecommend() {
    var list = [];

    try {
        let response = await axios.get('/recommend/resource');

        if (response.data.code !== 200) {
            throw response.data;
        } else {
            response.data.recommend.map(e => {
                list.push({
                    id: e.id.toString(),
                    type: 0,
                    name: e.name,
                    played: e.playcount,
                    cover: `${e.picUrl}?param=130y130`,
                    background: e.creator.backgroundUrl,
                    link: `/player/0/${e.id}`
                });
            });
        }
    } catch (ex) {
        error('Failed to get recommend: %O', ex);
    }

    return list;
}

router.get('/:id?', async(req, res) => {
    debug('Handle request for /home');

    var list = [];
    var unique = [];
    var id = req.params.id;

    debug('Params \'id\': %s', id);

    if (id) {
        list = [
            ...(await getLiked(id)),
            ...(await getDaily()),
            ...(await getRecommend()),
            ...(await getPersonalized()),
            ...(await getNewest()),
        ];
    } else {
        let personalized = await getPersonalized();

        personalized[0].songs = await getSongs(personalized[0].id);
        list = [
            ...personalized,
            ...(await getNewest()),
        ];
    }

    // Remove the duplicate items
    list.map(e => {
        var index = unique.findIndex(item => item.id === e.id);

        if (index === -1) {
            unique.push(e);
        }
    });

    res.send({
        list: unique,
    });
});

module.exports = router;
