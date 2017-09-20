
import express from 'express';
import axios from 'axios';
import uuid from 'uuid';
import _debug from 'debug';

const debug = _debug('dev:api');
const error = _debug('dev:error');
const router = express();

async function getTops() {
    var response = await axios.get('/top/playlist/highquality', {
        params: {
            limit: 30,
        }
    });
    var list = [];

    if (response.data.code !== 200) {
        error('Failed to get tops: %O', response.data);
    } else {
        response.data.playlists.map(e => {
            list.push({
                id: e.id,
                name: e.name,
                played: e.playCount,
                cover: `${e.coverImgUrl}?param=13y130`,
                link: `/player/0/${e.id}`,
            });
        });
    }

    return list;
}

async function getList(id) {
    var likes = await axios.get(`/user/playlist?uid=${id}`);
    var recommend = await axios.get('/recommend/resource');
    var daily = await axios.get('/recommend/songs');
    var personalized = await axios.get('/personalized');

    if (false
        || likes.data.code !== 200
        || recommend.data.code !== 200
        || daily.data.code !== 200
        || personalized.data.code !== 200) {
        error('Failed to get list: %O, %O, %O, %O', likes.data, recommend.data, daily.data, personalized.data);
    } else {
        let songs = [];

        likes = likes.data.playlist[0];

        try {
            let response = await axios.get(`/playlist/detail?id=${likes.id}`);

            if (response.data.code === 200) {
                songs = response.data.playlist.tracks.map(e => e.id);
            }
        } catch (ex) {
            debug('Failed to get playlist %s, %O', likes.id, ex);
        }

        return [
            {
                id: likes.id,
                name: likes.name,
                size: likes.trackCount,
                updateTime: likes.updateTime,
                publishTime: likes.publishTime,
                link: `/player/0/${likes.id}`,
                songs,
            },
            {
                id: uuid.v4(),
                name: '每日推荐歌曲',
                size: daily.data.recommend.length,
                songs: daily.data.recommend.map(e => {
                    var { album, artists } = e;

                    return {
                        id: e.id,
                        name: e.name,
                        duration: e.dt,
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
            },
            ...recommend.data.recommend
                .map(e => ({
                    id: e.id,
                    name: e.name,
                    played: e.playcount,
                    cover: `${e.picUrl}?param=130y130`,
                    link: `/player/0/${e.id}`
                })),
            ...personalized.data.result
                .map(e => ({
                    id: e.id,
                    name: e.name,
                    played: e.playCount,
                    cover: `${e.picUrl}?param=130y130`,
                    link: `/player/0/${e.id}`
                })),
        ];
    }

    return [];
}

router.get('/:id?', async(req, res) => {
    debug('Handle request for /home');

    var list = [];
    var id = req.params.id;

    debug('Params \'id\': %s', id);

    if (id) {
        list = await getList(id);
    } else {
        list = await getTops();
    }

    res.send({
        list,
    });
});

module.exports = router;
