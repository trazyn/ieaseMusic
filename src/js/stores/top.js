
import { observable, action } from 'mobx';
import axios from 'axios';

class Top {
    @observable loading = true;
    @observable list = [];

    @action async getList() {
        self.loading = true;

        /**
            "0": 云音乐新歌榜,
            "1": 云音乐热歌榜,
            "2": 网易原创歌曲榜,
            "3": 云音乐飙升榜,
            "4": 云音乐电音榜,
            "5": UK排行榜周榜,
            "6": 美国Billboard周榜
            "7": KTV嗨榜,
            "8": iTunes榜,
            "9": Hit FM Top榜,
            "10": 日本Oricon周榜
            "11": 韩国Melon排行榜周榜,
            "12": 韩国Mnet排行榜周榜,
            "13": 韩国Melon原声周榜,
            "14": 中国TOP排行榜(港台榜),
            "15": 中国TOP排行榜(内地榜)
            "16": 香港电台中文歌曲龙虎榜,
            "17": 华语金曲榜,
            "18": 中国嘻哈榜,
            "19": 法国 NRJ EuroHot 30周榜,
            "20": 台湾Hito排行榜,
            "21": Beatport全球电子舞曲榜
         * */
        var response = await axios.get('/api/top/0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21');

        self.list = response.data.list;
        self.loading = false;
    }
}

const self = new Top();
export default self;
