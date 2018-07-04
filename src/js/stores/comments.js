
import { observable, action } from 'mobx';
import axios from 'axios';

import controller from './controller';

class Comments {
    @observable loading = true;
    @observable hotList = [];
    @observable newestList = [];
    @observable total = 0;
    @observable song = {
        album: {},
        artist: [],
    };

    nextHref = '';

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

    @action async like(id, liked) {
        var response = await axios.get(`/api/comments/like/${id}/${controller.song.id}/${+liked}`);
        var data = response.data;

        if (data.success === true) {
            let comment = [...self.hotList.slice(), ...self.newestList.slice()].find(e => e.commentId === id);

            comment.likedCount += liked ? 1 : -1;
            comment.liked = liked;
        }
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
