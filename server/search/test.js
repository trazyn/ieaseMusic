
import search from './Baidu';

async function test() {
    var res = {};
    var rp = require('request-promise-native').defaults({
        proxy: 'http://127.0.0.1:1087',
        strictSSL: false
    });

    try {
        res = await search(rp, '尘埃', '王菲');
        console.log(res);
    } catch (ex) {
        console.error(ex);
    }
    return res;
}

test();
