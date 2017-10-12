
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
        case '1000':
            data = await getPlaylists(keyword, offset);
            break;
    }

    res.send(data);
});

module.exports = router;
