
import express from 'express';
import axios from 'axios';
import _debug from 'debug';

const debug = _debug('dev:api');
const error = _debug('dev:error');
const router = express();

router.get('/', async(req, res) => {
    debug('Handle request for /top');

    var list = [];

    try {
        let response = await axios.get(`/toplist`);
        let data = response.data.result;

        if (response.data.code !== 200) {
            throw data;
        }

        list = response.data.list.map(data => {
            return {
                name: data.name,
                played: data.playCount,
                updateTime: data.updateTime,
                size: data.trackCount,
                link: `/player/0/${data.id}`,
                cover: data.coverImgUrl,
            };
        });
    } catch (ex) {
        error('Failed to get top list: %O', ex);
    }

    res.send({
        list,
    });
});

module.exports = router;
