
import { observable, action } from 'mobx';
import controller from './controller';

class UpNext {
    @observable show = false;
    @observable song = {
        album: {},
        artists: [],
    };

    // Save the canceled song
    canceled = null;

    @action toggle(song, show = !self.show) {
        self.song = song;
        self.show = show;
    }

    @action cancel(song = controller.song) {
        self.canceled = song;

        if (song) {
            self.show = false;
        }
    }
}

const self = new UpNext();
export default self;
