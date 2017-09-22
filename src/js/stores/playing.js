
import { observable, action } from 'mobx';
import han from 'han';

import controller from './controller';

class Playing {
    @observable show = false;
    @observable filtered = [];

    @action toggle(show = !self.show) {
        self.show = show;
    }

    @action doFilter(text) {
        var songs = [];

        // Convert text to chinese pinyin
        text = han.letter(text.trim());

        songs = controller.playlist.songs.filter(e => {
            return false
                // Fuzzy match the song name
                || han.letter(e.name).indexOf(text) > -1
                // Fuzzy match the album name
                || han.letter(e.album.name).indexOf(text) > -1
                // Mathc the artist name
                || e.artists.findIndex(e => han.letter(e.name).indexOf(text) > -1) !== -1
            ;
        });

        self.filtered = songs;
    }

    filter(text = '') {
        clearTimeout(self.timer);
        self.timer = setTimeout(() => self.doFilter(text), 50);
    }
}

const self = new Playing();
export default self;
