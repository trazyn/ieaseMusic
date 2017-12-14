
import search from './index';

async function test() {
    var res = {};
    try {
        res = await search('未接来电', '杨乃文');
        console.log(res);
    } catch (ex) {
        console.error(ex);
    }
    return res;
}

test();
