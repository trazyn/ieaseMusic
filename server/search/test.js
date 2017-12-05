
import search from './index';

async function test() {
    var res = {};
    try {
        res = await search('我的一个道姑朋友（cover タイナカ 彩智）（Cover Lon）', '以冬');
        console.log(res);
    } catch (ex) {
        console.error(ex);
    }
    return res;
}

test();
