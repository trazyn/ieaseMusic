
import { observable, action } from 'mobx';
import axios from 'axios';
import han from 'han';

import helper from 'utils/helper';

class Player {
    @observable loading = true;
    @observable songs = [];
    @observable filtered = [];
    @observable meta = {
        pallet: [
            [0, 0, 0],
        ],
        author: [],
    };

    // Show filter
    @observable searching = false;
    @observable keywords;

    // Recommend albums and playlist
    @observable recommend = [];
    // Recent user
    @observable users = [];
    // Similar artist
    @observable artists = [];

    @action async getDetail(type, id) {
        var response = await axios.get(`/api/player/${type}/${id}`);

        var detail = response.data;
        var pallet = await helper.getPallet(detail.meta.cover);

        detail.meta.pallet = pallet;

        self.songs.replace(detail.songs);
        self.meta = detail.meta;
    }

    @action async getRelated(song) {
        var response = await axios.get(`/api/player/related/${song.id}/${song.artists[0]['id']}`);
        var data = response.data;

        if (data) {
            self.recommend = data.playlists;
            self.users = data.users;
            self.artists = data.artists;
        }
    }

    @action async subscribe(subscribed) {
        var response = await axios.get(
            subscribed
                ? `/api/player/subscribe/${self.meta.id}`
                : `/api/player/unsubscribe/${self.meta.id}`
        );
        var data = response.data;

        if (data.success) {
            self.meta.subscribed = subscribed;
        }
    }

    @action toggleLoading(show = !self.loading) {
        self.loading = show;
    }

    @action toggleSearch(show = !self.searching) {
        self.searching = show;
    }

    @action doFilter(text) {
        var songs = [];

        // Convert text to chinese pinyin
        text = han.letter(text.trim());

        songs = self.songs.filter(e => {
            return false
                // Fuzzy match the song name
                || han.letter(e.name).indexOf(text) > -1
                // Fuzzy match the album name
                || han.letter(e.album.name).indexOf(text) > -1
                // Mathc the artist name
                || e.artists.findIndex(e => han.letter(e.name).indexOf(text) > -1) !== -1
            ;
        });

        self.keywords = text;
        self.filtered = songs;
    }

    filter(text = '') {
        clearTimeout(self.timer);
        self.timer = setTimeout(() => self.doFilter(text), 50);
    }
}

const self = new Player();
export default self;
