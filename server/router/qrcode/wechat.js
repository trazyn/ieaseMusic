
import url from 'url';
import rp from 'request-promise-native';

const wechat = {
    qrcode(response) {
        var matched = response.body.match(/(\/connect\/qrcode\/[\w-_]+)/);
        // eslint-disable-next-line
        var q = url.parse(response.request.href, true);

        if (!matched) {
            throw Error('Failed to generate wechat QRCode.');
        }

        var ticket = matched[1].split('/')[3];

        return {
            ticket,
            url: `https://open.weixin.qq.com/connect/qrcode/${ticket}`,
            state: q.query.state,
        };
    },

    async polling(ticket) {
        var response = await rp.get({
            uri: `https://long.open.weixin.qq.com/connect/l/qrconnect?uuid=${ticket}&_=${Date.now()}`,
            jar: true,
            json: false,
            resolveWithFullResponse: true,
        });
        var matched = response.body.match(/wx_errcode=(\d+).*'(.*)';$/);

        if (!matched) {
            throw Error('Invalid wechat ticket');
        }

        /**
         * 408: continue
         * 404: scanned
         * 403: canceled
         * 405: done
         * */
        var res = {
            wx_errcode: +matched[1],
            wx_code: matched[2],
        };

        switch (res.wx_errcode) {
            case 405:
                return res.wx_code;
            case 408:
            case 404:
                return wechat.polling(ticket);
            case 403:
                throw Error('Login by wechat, canceled');
            default:
                throw Error('An error occurred while login by wechat');
        }
    }
};

module.exports = wechat;
