
import { observable, action } from 'mobx';
import axios from 'axios';

class Search {
    @observable loading = false;
    @observable show = true;
    @observable playlists = [];
    @observable albums = [];
    @observable artists = [];
    @observable users = [];

    /**
        Search type

        10: 专辑
        100: 歌手
        1000: 歌单
        1002: 用户
        1004: MV
        1006: 歌词
        1009: 电台
     * */

    // URL of get more playlists
    nextHref4playlists = '';

    @action async getPlaylists(keyword) {
        self.loading = true;

        var response = await axios.get(`/api/search/1000/30/${keyword}`);
        var data = response.data;

        self.playlists = data.playlists;
        self.nextHref4playlists = data.nextHref;
        self.loading = false;
    }

    @action async loadmorePlaylists() {
        if (!self.nextHref4playlists) {
            return;
        }

        var response = await axios.get(self.nextHref4playlists);
        var data = response.data;

        self.playlists.push(...data.playlists);
        self.nextHref4playlists = data.nextHref;
    }

    @action toggle(show = !self.show) {
        self.show = show;
    }
}

const self = new Search();
export default self;
