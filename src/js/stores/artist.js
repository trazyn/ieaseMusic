
import { observable, action } from 'mobx';
import axios from 'axios';

class Artist {
    @observable loading = true;

    // Profile of the artist
    @observable profile = {};

    // All albums of artist
    @observable albums = [];

    // Similar artists
    @observable similar = [];

    // Contains 'id' and 'songs'
    @observable playlist = {
        songs: [],
    };

    @action async getArtist(id) {
        self.loading = true;

        var response = await axios.get(`/artist/${id}`);
        var data = response.data;

        if (data) {
            self.profile = data.profile;
            self.playlist = data.playlist;
            self.albums = data.albums;
            self.similar = data.similar;
        }

        self.loading = false;
    }
}

const self = new Artist();
export default self;
