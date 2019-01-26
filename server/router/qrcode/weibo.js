
import url from 'url';
import rp from 'request-promise-native';

const weibo = {
    async qrcode(response) {
        // eslint-disable-next-line
        var q = url.parse(response.request.href, true);
        var state = q.query.state;
        var res = await rp.get({
            uri: `https://api.weibo.com/oauth2/qrcode_authorize/generate`,
            qs: {
                client_id: '301575942',
                redirect_uri: 'http://music.163.com/back/weibo',
                scope: 'friendships_groups_read,statuses_to_me_read,follow_app_official_microblog',
                response_type: 'code',
                state,
                _rnd: +new Date(),
            },
            jar: true,
            json: true,
            resolveWithFullResponse: true,
        });

        return {
            state,
            ticket: res.body.vcode,
            url: res.body.url,
        };
    },

    async polling(ticket) {
        var response = await rp.get({
            uri: `https://api.weibo.com/oauth2/qrcode_authorize/query`,
            qs: {
                _rnd: Date.now(),
                vcode: ticket,
            },
            jar: true,
            json: true,
            resolveWithFullResponse: true,
        });

        /**
         * 1: continue
         * 2: scanned
         * 3: done
         * */
        switch (+response.body.status) {
            case 1:
            case 2:
                return weibo.polling(ticket);
            case 3:
                // eslint-disable-next-line
                let q = url.parse(response.body.url, true);
                return q.query.code;
            default:
                throw Error('An error occurred while login by weibo');
        }
    }
};

module.exports = weibo;
