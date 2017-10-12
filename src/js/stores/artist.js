
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

    @action async follow(followed) {
        var response = await axios.get(
            followed
                ? `/api/artist/unfollow/${self.profile.id}`
                : `/api/artist/follow/${self.profile.id}`
        );
        var data = response.data;

        if (data.success) {
            self.profile = Object.assign({}, self.profile, {
                followed: !followed,
            });
        }
    }
}

const self = new Artist();
export default self;
