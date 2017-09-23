
import express from 'express';
import axios from 'axios';
import _debug from 'debug';

const debug = _debug('dev:api');
const error = _debug('dev:error');
const router = express();

router.get('/:ids', async(req, res) => {
    debug('Handle request for /top');

    var list = [];
    var ids = req.params.ids;

    debug('Params \'ids\': %s', ids);

    ids = ids.split(',');

    try {
        list = await Promise.all(ids.map(async e => {
            let response = await axios.get(`/top/list?idx=${e}`);
            let data = response.data.result;

            if (response.data.code !== 200) {
                throw data;
            }

            return {
                name: data.name,
                played: data.playCount,
                updateTime: data.updateTime,
                size: data.trackCount,
                link: `/player/0/${data.id}`,
                cover: data.tracks[0]['album']['picUrl'],
            };
        }));
    } catch (ex) {
        error('Failed to get top list: %O', ex);
    }

    res.send({
        list,
    });
});

module.exports = router;
