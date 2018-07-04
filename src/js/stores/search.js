
import { observable, action } from 'mobx';
import axios from 'axios';

class Search {
    @observable loading = false;
    @observable playlists = [];
    @observable albums = [];
    @observable artists = [];
    @observable users = [];

    /**
        Search type

        10: 专辑
        100: 歌手
        1000: 歌单
        1002: 用户
        1004: MV
        1006: 歌词
        1009: 电台
     * */

    // URL of get more playlists
    nextHref4playlists = '';
    nextHref4albums = '';
    nextHref4artists = '';
    nextHref4users = '';

    @action async getPlaylists(keyword) {
        self.loading = true;

        var response = await axios.get(`/api/search/1000/0/${keyword}`);
        var data = response.data;

        self.playlists = data.playlists;
        self.nextHref4playlists = data.nextHref;
        self.loading = false;
    }

    @action async loadmorePlaylists() {
        if (!self.nextHref4playlists) {
            return;
        }

        var response = await axios.get(self.nextHref4playlists);
        var data = response.data;

        self.playlists.push(...data.playlists);
        self.nextHref4playlists = data.nextHref;
    }

    @action async getAlbums(keyword) {
        self.loading = true;

        var response = await axios.get(`/api/search/10/0/${keyword}`);
        var data = response.data;

        self.albums = data.albums;
        self.nextHref4albums = data.nextHref;
        self.loading = false;
    }

    @action async loadmoreAlbums() {
        if (!self.nextHref4albums) {
            return;
        }

        var response = await axios.get(self.nextHref4albums);
        var data = response.data;

        self.albums.push(...data.albums);
        self.nextHref4albums = data.nextHref;
    }

    @action async getArtists(keyword) {
        self.loading = true;

        var response = await axios.get(`/api/search/100/0/${keyword}`);
        var data = response.data;

        self.artists = data.artists;
        self.nextHref4artists = data.nextHref;
        self.loading = false;
    }

    @action async loadmoreArtists() {
        if (!self.nextHref4artists) {
            return;
        }

        var response = await axios.get(self.nextHref4artists);
        var data = response.data;

        self.artists.push(...data.artists);
        self.nextHref4artists = data.nextHref;
    }

    @action async getUsers(keyword) {
        self.loading = true;

        var response = await axios.get(`/api/search/1002/0/${keyword}`);
        var data = response.data;

        self.users = data.users;
        self.nextHref4users = data.nextHref;
        self.loading = false;
    }

    @action async loadmoreUsers() {
        if (!self.nextHref4users) {
            return;
        }

        var response = await axios.get(self.nextHref4users);
        var data = response.data;

        self.users.push(...data.users);
        self.nextHref4users = data.nextHref;
    }
}

const self = new Search();
export default self;
