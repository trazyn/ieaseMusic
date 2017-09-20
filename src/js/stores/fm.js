
import { observable, action } from 'mobx';
import axios from 'axios';

class FM {
    @observable loading = true;
    @observable songs = [];

    @action async getSongs() {
        self.loading = true;

        var response = await axios.get(`/fm`);

        self.songs = response.data.songs;
        self.loading = false;
    }
}

const self = new FM();
export default self;
