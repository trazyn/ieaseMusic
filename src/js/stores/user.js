
import { observable, action } from 'mobx';
import axios from 'axios';

class User {
    @observable loading = true;
    @observable profile = {};
    @observable playlists = [];

    @action async getUser(userid) {
        self.loading = true;

        var response = await axios.get(`/api/user/${userid}`);

        self.profile = response.data.profile;
        self.playlists = response.data.playlists;
        self.loading = false;
    }

    @action async follow(followed) {
        var response = await axios.get(
            followed
                ? `/api/user/unfollow/${self.profile.id}`
                : `/api/user/follow/${self.profile.id}`
        );
        var data = response.data;

        if (data.success) {
            self.profile = Object.assign({}, self.profile, {
                followed: !followed,
            });
        }
    }
}

const self = new User();
export default self;
