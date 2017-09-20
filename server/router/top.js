
import express from 'express';
import axios from 'axios';
import _debug from 'debug';

const debug = _debug('dev:api');
const error = _debug('dev:error');
const router = express();

router.get('/:ids', async(req, res) => {
    debug('Handle request for /top');

    var ids = req.params.ids;

    debug('Params \'ids\': %s', ids);

    ids = ids.split(',');

    var list = await Promise.all(ids.map(async e => {
        var response = await axios.get(`/top/list?idx=${e}`);

        if (response.data.code !== 200) {
            error('Failed to get top list \'%s\': %O', e, response.data);
        }

        var data = response.data.result;

        return {
            name: data.name,
            played: data.playCount,
            updateTime: data.updateTime,
            size: data.trackCount,
            link: `/player/0/${data.id}`,
            cover: `${data.tracks[0]['album']['picUrl']}?param=300y300`
        };
    }));

    res.send({
        list,
    });
});

module.exports = router;
