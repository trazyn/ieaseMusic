
import { observable, action } from 'mobx';
import { ipcRenderer } from 'electron';
import axios from 'axios';

import fm from './fm';
import preferences from './preferences';

const PLAYER_SHUFFLE = 0;
const PLAYER_REPEAT = 1;
const PLAYER_LOOP = 2;
const MODES = [PLAYER_SHUFFLE, PLAYER_REPEAT, PLAYER_LOOP];

class Controller {
    @observable playing = false;
    @observable mode = PLAYER_SHUFFLE;

    // A strcut should contains 'id' and 'songs'
    @observable playlist = {};

    // Currently played song
    @observable song = {};

    // Keep a history with current playlist
    history = [];

    @action async setup(playlist) {
        if (self.playlist.id === playlist.id
            && playlist.id !== 'PERSONAL_FM') {
            return;
        }

        self.playing = false;
        self.history = [];

        // Disconnect all observer
        self.playlist = JSON.parse(JSON.stringify(playlist));
        self.song = playlist.songs[0];

        ipcRenderer.send('update-playing', {
            songs: playlist.songs.slice(),
        });
    }

    @action async play(songid, forward = true) {
        var songs = self.playlist.songs;
        var song;

        if (songid) {
            song = songs.find(e => e.id === songid);
        }

        song = song || songs[0];

        // Save to history list
        if (!self.history.includes(songid)) {
            self.history[forward ? 'push' : 'unshift'](song.id);

            ipcRenderer.send('update-history', {
                songs: self.playlist.songs.slice().filter(e => self.history.includes(e.id)),
            });
        }

        if (self.playlist.id === 'PERSONAL_FM') {
            fm.song = song;
        }

        if (preferences.showNotification) {
            let notification = new window.Notification(song.name, {
                icon: song.album.cover,
                body: song.artists.map(e => e.name).join(' / '),
                vibrate: [200, 100, 200],
            });

            notification.onclick = () => {
                ipcRenderer.send('show');
            };
        }

        ipcRenderer.send('update-status', {
            playing: true,
            song,
        });

        self.song = song;
        self.playing = true;
        await self.resolveSong();
    }

    @action async resolveSong() {
        var song = self.song;
        var response = await axios.get(`/api/player/song/${song.id}/${song.name}/${song.artists.map(e => e.name).join(',')}/${preferences.highquality}?` + +new Date());
        var data = response.data.song;

        if (!data.src) {
            console.error('Bad audio src.');
            self.next();
            return;
        }

        self.song = Object.assign({}, self.song, { data });
    }

    @action async next(loop = false) {
        var songs = self.playlist.songs;
        var history = self.history;
        var index = history.indexOf(self.song.id);
        var next;

        switch (true) {
            case loop === true
                    && self.mode === PLAYER_LOOP:
                // Fix https://github.com/trazyn/ieaseMusic/issues/68
                next = self.song.id;
                break;

            case self.playlist.id === 'PERSONAL_FM':
                fm.next();
                return;

            /* Already in history */
            case ++index < history.length:
                next = history[index];
                break;

            case self.mode !== PLAYER_SHUFFLE:
                // Get song from crrent track list
                let song;

                index = songs.findIndex(e => e.id === self.song.id);

                if (++index < songs.length) {
                    song = songs[index];
                } else {
                    song = songs[0];
                }

                next = song.id;
                break;

            default:
                // Random a song from the remaining
                songs = songs.filter(e => !history.includes(e.id));

                if (songs.length) {
                    next = songs[Math.floor(Math.random() * songs.length)]['id'];
                } else {
                    next = history[0];
                }
        }

        await self.play(next);
    }

    @action async prev() {
        var history = self.history;
        var index = history.indexOf(self.song.id);

        if (--index >= 0) {
            await self.play(history[index], false);
            return;
        }

        if (self.mode === PLAYER_SHUFFLE) {
            let songs = self.playlist.songs.filter(e => history.indexOf(e.id) === -1);
            let index = Math.floor(Math.random() * songs.length);
            let song = songs[index];

            if (!songs.length) {
                await self.play(history[history.length - 1]);
                return;
            }
            await self.play(song.id, false);
            return;
        }

        index = self.playlist.songs.findIndex(e => e.id === self.song.id);

        if (--index < 0) {
            index = self.playlist.songs.length - 1;
        }

        await self.play(self.playlist.songs[index]['id'], false);
    }

    @action pause() {
        self.playing = false;
    }

    @action toggle() {
        self.playing = !self.playing;

        ipcRenderer.send('update-status', {
            playing: self.playing,
            song: self.song,
        });
    }

    @action changeMode(mode = PLAYER_REPEAT) {
        var index = MODES.indexOf(self.mode);

        if (MODES.includes(mode)) {
            self.mode = mode;
        } else {
            if (++index < MODES.length) {
                self.mode = MODES[index];
            } else {
                self.mode = PLAYER_SHUFFLE;
            }
        }
    }
}

const self = new Controller();
export { PLAYER_LOOP, PLAYER_SHUFFLE, PLAYER_REPEAT };
export default self;
