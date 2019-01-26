
import express from 'express';
import http from 'http';
import rp from 'request-promise-native';
import setCookie from 'set-cookie-parser';
import _debug from 'debug';
import wechat from './wechat';
import weibo from './weibo';

const debug = _debug('dev:api');
const error = _debug('dev:api:error');
const router = express();
const adaptors = {
    '10': wechat,
    '2': weibo,
};

router.get('/generate/:type', async(req, res) => {
    debug('Handle request for /qrcode/generate');

    var type = req.params.type;
    var adaptor = adaptors[type];

    /**
     * 10: wechat
     * 2: weibo
     * */
    debug('Params \'type\': %d', type);

    try {
        var response = await rp.get({
            uri: `http://music.163.com/api/sns/authorize?snsType=${type}&clientType=web2&callbackType=Login&forcelogin=true`,
            resolveWithFullResponse: true,
        });
        var payload = await adaptor.qrcode(response);
        res.send(
            Object.assign(payload, { type })
        );
    } catch (ex) {
        error(ex);
        res.send({
            success: false,
        });
    }
});

router.post('/polling', async(req, res) => {
    debug('Handle request for /qrcode/polling');

    var { ticket, state, type } = req.body;
    var adaptor = adaptors[type];

    debug('Params \'ticket\': %s', ticket);
    debug('Params \'state\': %s', state);
    debug('Params \'type\': %d', type);

    try {
        var code = await adaptor.polling(ticket);

        switch (+type) {
            case 10:
                type = 'weichat';
                break;
            case 2:
                type = 'weibo';
                break;
            default:
                throw Error('Unknow type: %d', type);
        }

        http.get(`http://music.163.com/back/${type}?code=${code}&state=${state}`, response => {
            var cookies = setCookie.parse(response, {
                decodeValues: true
            });

            if (cookies.length === 0) {
                throw Error('No Cookie');
            }

            cookies.forEach(
                e => {
                    res.cookie(e.name, e.value);
                }
            );
            res.send({ success: true });
        });
    } catch (ex) {
        error(ex);
        res.send({
            success: false,
        });
    }
});

module.exports = router;
