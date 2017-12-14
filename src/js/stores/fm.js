
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
        controller.changeMode();
        self.shuffle();
        self.preload = Function;
    }

    @action async shuffle() {
        self.loading = true;

        var response = await axios.get(`/api/fm`);
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

    // Ban a song
    @action async ban(id) {
        var response = await axios.get(`/fm_trash?id=${id}`);

        if (response.data.code === 200) {
            self.next();
        }
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
