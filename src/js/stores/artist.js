
import { observable, action } from 'mobx';
import axios from 'axios';

class Artist {
    @observable loading = true;
    @observable profile = {};
    @observable songs = [];
    @observable albums = [];
    @observable similar = [];

    @action async getArtist(id) {
        self.loading = true;

        var response = await axios.get(`/artist/${id}`);
        var data = response.data;

        if (data) {
            self.profile = data.profile;
            self.songs.replace(data.songs);
            self.albums.replace(data.albums);
            self.similar.replace(data.similar);
        }

        self.loading = false;
    }
}

const self = new Artist();
export default self;
