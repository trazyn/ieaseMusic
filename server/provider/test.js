
import search from './Kuwo';

async function test() {
    var res = {};
    var rp = require('request-promise-native').defaults({
        strictSSL: true,
        json: true,
    });

    try {
        res = await search(rp, '演员', '薛之谦');
        console.log(res);
        console.log(res.purview_roles);
    } catch (ex) {
        console.error(ex);
    }
    return res;
}

test();
