
import { observable, action } from 'mobx';
import axios from 'axios';

import controller from './controller';

class Lyrics {
    @observable loading = true;
    @observable show = false;
    @observable list = {};

    @action toggle(show = !self.show) {
        self.show = show;
    }

    @action async getLyrics() {
        self.loading = true;

        var response = await axios.get(`/api/lyrics/${controller.song.id}`);
        var data = response.data;

        self.list = data;
        self.loading = false;
    }
}

const self = new Lyrics();
export default self;
