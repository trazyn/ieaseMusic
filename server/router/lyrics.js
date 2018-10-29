
import express from 'express';
import axios from 'axios';
import _debug from 'debug';

const debug = _debug('dev:api');
const error = _debug('dev:error');
const router = express();

router.get('/:id', async(req, res) => {
    debug('Handle request for /lyrics');

    var result = {};
    var id = req.params.id;

    debug('Params \'id\': %s', id);

    try {
        var response = await axios.get(`/lyric`, {
            params: {
                id,
            }
        });
        var data = response.data;

        if (data.code !== 200) {
            throw data;
        } else {
            if (data.lrc === undefined) {
                return;
            }

            let lyrics = data.lrc.lyric.split('\n');

            lyrics.map(e => {
                let match = e.match(/\[.+\]/);

                if (!match) {
                    return;
                }

                let timestamp = match[0].replace(/\D/g, ':').replace(/^:|:$/g, '').split(':');
                let content = e.replace(/\[.+\]/, '');
                let times = parseInt(+timestamp[0] * 60 * 1000) + parseInt(+timestamp[1] * 1000) + parseInt(timestamp[2]);

                result[times] = content;
            });
        }
    } catch (ex) {
        error('Failed to get lyrics: %O', ex);
    }

    res.send(result);
});

module.exports = router;
