
import { observable, action } from 'mobx';
import axios from 'axios';

import helper from 'utils/helper';

class Player {
    @observable loading = true;
    @observable songs = [];
    @observable meta = {
        pallet: [
            [0, 0, 0],
        ],
        author: [],
    };

    // Recommend albums and playlist
    @observable recommend = [];
    // Recent user
    @observable users = [];
    // Similar artist
    @observable artists = [];

    @action async getDetail(type, id) {
        var response = await axios.get(`/player/${type}/${id}`);

        var detail = response.data;
        var pallet = await helper.getPallet(detail.meta.cover);

        detail.meta.pallet = pallet;

        self.songs.replace(detail.songs);
        self.meta = detail.meta;
    }

    @action async getRelated(song) {
        var response = await axios.get(`/player/related/${song.id}/${song.artists[0]['id']}`);
        var data = response.data;

        if (data) {
            self.recommend = data.playlists;
            self.users = data.users;
            self.artists = data.artists;
        }
    }

    @action toggleLoading(show = !self.loading) {
        self.loading = show;
    }
}

const self = new Player();
export default self;
