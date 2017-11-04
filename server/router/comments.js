
import express from 'express';
import axios from 'axios';
import _debug from 'debug';

const debug = _debug('dev:api');
const error = _debug('dev:error');
const router = express();

router.get('/:id/:offset?', async(req, res) => {
    debug('Handle request for /comments');

    var result = {};
    var id = req.params.id;
    var offset = req.params.offset || 0;

    debug('Params \'id\': %s', id);
    debug('Params \'offset\': %s', offset);

    try {
        var response = await axios.get(`/comment/music`, {
            params: {
                id,
                limit: 30,
                offset,
            }
        });
        var data = response.data;

        if (data.code !== 200) {
            throw data;
        } else {
            result = {
                newestList: data.comments,
                hotList: data.hotComments,
                total: data.total,
                nextHref: data.more ? `/api/comments/${id}/${+offset + 30}` : '',
            };
        }
    } catch (ex) {
        error('Failed to get comments: %O', ex);
    }

    res.send(result);
});

module.exports = router;
