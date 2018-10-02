
import { observable, action } from 'mobx';
import axios from 'axios';

import player from './player';
import home from './home';
import storage from 'common/storage';
import helper from 'utils/helper';
import lastfm from 'utils/lastfm';

const CancelToken = axios.CancelToken;

// Only one canceler will be hit
let cancelWaitQRCodeScan;
let cancelWaitQRCodeConfirm;

function getProfile(data) {
    var ele = document.createElement('div');
    var script = document.createElement('script');

    ele.innerHTML = data;
    // Remove the code of close window
    script.text = ele.firstChild.innerText.replace(/try{.+/, '');
    document.body.append(script);

    return window._data.profile;
}

class Me {
    @observable initialized = false;
    @observable logining = false;
    @observable profile = {};
    @observable scaner = {};

    // Store the liked song
    @observable likes = new Map();

    @action async init() {
        var profile = await storage.get('profile');

        if (!profile) {
            profile = {};
        } else {
            // Cookie expired
            let response = await axios.get('/login/refresh?' + +Date.now());

            if (response.data.code === 301) {
                profile = {};
                await storage.remove('profile');
            }
        }

        // App has been initialized
        self.profile = profile;
        self.initialized = true;
    }

    @action async qrcode() {
        cancelWaitQRCodeScan && cancelWaitQRCodeScan();
        cancelWaitQRCodeConfirm && cancelWaitQRCodeConfirm();
        self.scaner = {};

        var response = await axios.get('/api/user/login/qrcode');

        if (response.data.success === false) {
            window.alert('Failed to login with QRCode, Please check your console(Press ⌘+⌥+I) and report it.');
            return;
        }

        self.scaner = response.data;
    }

    async waitQRCodeConfirm(done) {
        var response = await axios.get(
            `${self.scaner.polling}&last=404&_${+new Date()}`,
            {
                cancelToken: new CancelToken(c => {
                    cancelWaitQRCodeConfirm = c;
                })
            }
        );

        // eslint-disable-next-line
        eval(response.data);

        // Waiting
        if (window.wx_errcode === 408) {
            self.waitQRCodeConfirm();
            return;
        }

        // Canceled by user
        if (window.wx_errcode === 403) {
            self.qrcode();
            return;
        }

        // User press ok
        if (window.wx_errcode === 405) {
            self.logining = true;
            let response = await axios.get(
                `/api/user/login/qrcode/${window.wx_code}/${self.scaner.state}`,
                {
                    cancelToken: new CancelToken(c => {
                        cancelWaitQRCodeConfirm = c;
                    })
                }
            );

            if (response.data.success === false) {
                window.alert('Failed to login with QRCode, Please check your console(Press ⌘+⌥+I) and report it.');
                return;
            }

            self.profile = getProfile(response.data);
            done();
            await storage.set('profile', self.profile);
            await self.init();
            await home.load();
            self.logining = false;
            return;
        }

        console.error(response);
    }

    async waitQRCodeScan(done) {
        var response = await axios.get(
            `${self.scaner.polling}&_${+new Date()}`,
            {
                cancelToken: new CancelToken(c => {
                    cancelWaitQRCodeScan = c;
                })
            }
        );

        // eslint-disable-next-line
        eval(response.data);

        // Waiting user scan
        if (window.wx_errcode === 408) {
            self.waitQRCodeScan();
            return;
        }

        // Wait user cofnirm
        if (window.wx_errcode === 404) {
            self.waitQRCodeConfirm(done);
            return;
        }

        console.error(response);
    }

    @action async login(phone, password) {
        self.logining = true;

        var formatter = helper.formatPhone(phone);
        var response = await axios.get('/login/cellphone', {
            params: {
                countrycode: formatter.code,
                phone: formatter.phone,
                password,
            }
        });

        if (response.data.code !== 200) {
            console.error(`Failed to login: ${response.data.msg}`);
            self.logining = false;
            return false;
        }

        self.profile = response.data.profile;
        await home.load();
        await storage.set('profile', self.profile);
        self.logining = false;

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
            mapping.set(e.id, true);
        });

        self.likes.replace(mapping);
    }

    // Check is a red heart song
    isLiked(id) {
        return self.hasLogin() && self.likes.get(id);
    }

    // Like a song
    @action async like(song) {
        await lastfm.love(song);

        if (await self.exeLike(song, true)) {
            self.likes.set(song.id, true);
        }
    }

    // Unlike a song
    @action async unlike(song) {
        await lastfm.unlove(song);
        self.likes.set(song.id, !(await self.exeLike(song, false)));
    }

    async exeLike(song, truefalse) {
        var response = await axios.get('/like', {
            params: {
                id: song.id,
                like: truefalse,
            }
        });

        // Update the playlist of player screen
        if (self.likes.get('id') === player.meta.id) {
            let songs = player.songs;
            let index = songs.findIndex(e => e.id === song.id);

            if (index === -1) {
                // You like this song
                songs = [
                    song,
                    ...songs,
                ];
            } else {
                // Remove song from playlist
                songs = [
                    ...songs.slice(0, index),
                    ...songs.slice(index + 1, songs.length),
                ];
            }

            player.songs = songs;
        }

        return response.data.code === 200;
    }

    hasLogin() {
        return !!self.profile.userId;
    }
}

const self = new Me();
export default self;
