
import search from './index';

async function test() {
    var res = {};
    try {
        res = await search('致青春', '王菲');
        console.log(res);
    } catch (ex) {
        console.error(ex);
    }
    return res;
}

test();
