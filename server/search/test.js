
import search from './index';

async function test() {
    var res = {};
    try {
        res = await search('你在终点等我', '王菲');
        console.log(res);
    } catch (ex) {
        console.error(ex);
    }
    return res;
}

test();
