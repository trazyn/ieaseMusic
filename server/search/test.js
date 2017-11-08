
import search from './index';

async function test() {
    var res = await search('一直想着他', '庄心妍');

    console.log(res);
    return res;
}

console.log(test());
