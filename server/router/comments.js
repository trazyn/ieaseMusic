
import express from 'express';
import axios from 'axios';
import _debug from 'debug';

const debug = _debug('dev:api');
const error = _debug('dev:error');
const router = express();

router.get('/like/:id/:songid/:like', async(req, res) => {
    debug('Handle request for /comments/like');

    var result = { success: false };
    var id = req.params.id;
    var songid = req.params.songid;
    var like = req.params.like;

    debug('Params \'id\': %s', id);
    debug('Params \'songid\': %s', songid);
    debug('Params \'liked\': %s', like);

    try {
        var response = await axios.get('/comment/like', {
            params: {
                id: songid,
                cid: id,
                type: 0,
                t: +like,
            }
        });
        var data = response.data;

        if (data.code !== 200) {
            throw data;
        } else {
            result = {
                success: true,
                liked: !!+like,
            };
        }
    } catch (ex) {
        error('Failed to like comment: %O', ex);
    }

    res.send(result);
});

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
