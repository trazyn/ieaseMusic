
import { observable, action } from 'mobx';
import axios from 'axios';

import storage from 'utils/storage';

class Me {
    @observable initialized = false;
    @observable logining = false;
    @observable profile = {};

    // Store the liked song
    @observable likes = new Map();

    @action async init() {
        var response = await axios.get('/login/refresh');
        var profile = await storage.get('profile');

        if (response.data.code !== 200
            || !profile) {
            self.profile = {};
            return false;
        }

        // App has been initialized
        self.profile = profile;
        self.initialized = true;

        return true;
    }

    @action async login(phone, password) {
        self.logining = true;

        var response = await axios.get('/login/cellphone', {
            params: {
                phone,
                password,
            }
        });

        self.logining = false;

        if (response.data.code !== 200) {
            console.error(`Failed to login: ${response.data.msg}`);
            return false;
        }

        self.profile = response.data.profile;

        await storage.set('profile', self.profile);
        return self.profile;
    }

    @action async logout() {
        await storage.remove('profile');
    }

    @action rocking(likes) {
        var mapping = new Map();

        // Keep the liked playlist id
        mapping.set('id', likes.id.toString());

        likes.songs.map(e => {
            mapping.set(e, true);
        });

        self.likes.replace(mapping);
    }

    // Check is a red heart song
    isLiked(id) {
        return self.hasLogin() && self.likes.get(id);
    }

    // Like a song
    like(id) {
        self.likes.set(id, true);
    }

    // Unlike a song
    unlike(id) {
        self.likes.set(id, false);
    }

    hasLogin() {
        return !!self.profile.userId;
    }
}

const self = new Me();
export default self;
