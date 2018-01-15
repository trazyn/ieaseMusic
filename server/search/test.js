
import search from './index';

async function test() {
    var res = {};
    try {
        res = await search('体面', '于文文');
        console.log(res);
    } catch (ex) {
        console.error(ex);
    }
    return res;
}

test();
