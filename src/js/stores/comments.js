
import { observable, action } from 'mobx';
import axios from 'axios';

class Comments {
    @observable loading = true;
    @observable show = false;
    @observable hotList = [];
    @observable newestList = [];
    @observable total = 0;
    @observable song = {
        album: {},
        artist: [],
    };
    nextHref = '';

    @action toggle(show = !self.show) {
        self.show = show;
    }

    @action async getList(song) {
        self.loading = true;

        var response = await axios.get(`/api/comments/${song.id}`);
        var data = response.data;

        self.song = song;
        self.hotList = data.hotList;
        self.newestList = data.newestList;
        self.total = data.total;
        self.nextHref = data.nextHref;
        self.loading = false;
    }

    @action async loadmore() {
        if (!self.nextHref) {
            return;
        }

        var response = await axios.get(self.nextHref);
        var data = response.data;

        self.newestList.push(...data.newestList);
        self.nextHref = data.nextHref;
    }
}

const self = new Comments();
export default self;
