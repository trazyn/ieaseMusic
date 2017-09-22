
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
        let response = await axios.get('/hot/album');

        if (response.data.code !== 200) {
            error('Failed to get hot album: %O', response.data);
        } else {
            response.data.albums.map(e => {
                list.push({
                    id: e.id,
                    type: 1,
                    name: e.name,
                    size: e.size,
                    cover: `${e.picUrl}?param=130y130`,
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
            error('Failed to get personalized: %O', response.data);
        } else {
            response.data.result.map(e => {
                list.push({
                    id: e.id,
                    type: 0,
                    name: e.name,
                    played: e.playCount,
                    cover: `${e.picUrl}?param=130y130`,
                    link: `/player/0/${e.id}`
                });
            });
        }
    } catch (ex) {
        error('Failed to get personalized: %O', ex);
    }

    return list;
}

async function getLiked(id) {
    var list = [];

    try {
        let response = await axios.get(`/user/playlist?uid=${id}`);

        if (response.data.code !== 200) {
            error('Failed to get liked: %O', response.data);
        } else {
            let liked = response.data.playlist[0];
            let songs = [];

            try {
                let response = await axios.get(`/playlist/detail?id=${liked.id}`);

                if (response.data.code === 200) {
                    songs = response.data.playlist.tracks.map(e => e.id);
                } else {
                    error('Failed to get playlist %s, %O', liked.id, response.data);
                }
            } catch (ex) {
                error('Failed to get playlist %s, %O', liked.id, ex);
            }

            list = [{
                id: liked.id,
                name: liked.name,
                size: liked.trackCount,
                updateTime: liked.updateTime,
                publishTime: liked.publishTime,
                link: `/player/0/${liked.id}`,
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
            error('Failed to get daily songs: %O', response.data);
        } else {
            list = [{
                id: uuid.v4(),
                name: '每日推荐歌曲',
                size: response.data.recommend.length,
                songs: response.data.recommend.map(e => {
                    var { album, artists } = e;

                    return {
                        id: e.id,
                        name: e.name,
                        duration: e.duration,
                        album: {
                            id: album.id,
                            name: album.name,
                            cover: `${album.picUrl}?param=100y100`,
                            link: `/player/1/${album.id}`,
                        },
                        artists: artists.map(e => ({
                            id: e.id,
                            name: e.name,
                            link: `/artist/${e.id}`,
                        }))
                    };
                }),
            }];
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
            error('Failed to get recommend: %O', response.data);
        } else {
            response.data.recommend.map(e => {
                list.push({
                    id: e.id,
                    type: 0,
                    name: e.name,
                    played: e.playcount,
                    cover: `${e.picUrl}?param=130y130`,
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
        list = [
            ...(await getPersonalized()),
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
