
import { observable, action } from 'mobx';
import axios from 'axios';

import controller from './controller';

class FM {
    @observable loading = true;
    @observable song = {};
    @observable playlist = {
        songs: [],
    };

    preload() {
        self.shuffle();
        self.preload = Function;
    }

    @action async shuffle() {
        self.loading = true;

        var response = await axios.get(`/fm`);

        self.playlist = response.data;
        self.song = self.playlist.songs[0];
        self.loading = false;
    }

    @action play() {
        if (controller.playlist.id === self.playlist.id) {
            controller.toggle();
            return;
        }

        controller.setup(self.playlist);
        controller.play();
    }

    @action async next() {
        var index = self.playlist.songs.findIndex(e => e.id === controller.song.id);

        if (controller.playlist.id !== self.playlist.id) {
            self.play();
            return;
        }

        if (++index < self.playlist.songs.length) {
            let next = self.playlist.songs[index];

            controller.play(next.id);
            return;
        }

        // Refresh the playlist
        await self.shuffle();
        controller.setup(self.playlist);
        controller.play();
    }
}

const self = new FM();
export default self;
