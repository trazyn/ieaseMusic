
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

        var response = await axios.get(`/api/artist/${id}`);
        var data = response.data;

        if (data) {
            self.profile = data.profile;
            self.playlist = data.playlist;
            self.albums = data.albums;
            self.similar = data.similar;
        }

        self.loading = false;
    }

    @action async follow(followed, id = self.profile.id) {
        var response = await axios.get(
            followed
                ? `/api/artist/unfollow/${id}`
                : `/api/artist/follow/${id}`
        );
        var data = response.data;

        if (data.success) {
            self.profile = Object.assign({}, self.profile, {
                followed: !followed,
            });
        }

        return data.success;
    }
}

const self = new Artist();
export default self;
