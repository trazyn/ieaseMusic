
import { observable, action } from 'mobx';

class UpNext {
    @observable show = false;
    @observable song = {
        album: {},
        artists: [],
    };

    @action toggle(song, show = !self.show) {
        self.song = song;
        self.show = show;
    }
}

const self = new UpNext();
export default self;
