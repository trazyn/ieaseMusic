
import { observable, action } from 'mobx';
import { ipcRenderer } from 'electron';
import axios from 'axios';

import fm from './fm';
import comments from './comments';
import upnext from './upnext';
import preferences from './preferences';
import lastfm from 'utils/lastfm';
import helper from 'utils/helper';

const PLAYER_SHUFFLE = 0;
const PLAYER_REPEAT = 1;
const PLAYER_LOOP = 2;
const MODES = [PLAYER_SHUFFLE, PLAYER_REPEAT, PLAYER_LOOP];
const CancelToken = axios.CancelToken;

let cancel;

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
        var songs = self.playlist.songs.slice();
        var song;

        if (!(upnext.canceled && upnext.canceled.id === songid)) {
            // Keep upnext modal singleton
            upnext.show = false;
        }

        if (songid) {
            song = songs.find(e => e.id === songid);
        }

        song = song || songs[0];

        // Save to history list
        if (!self.history.includes(songid)) {
            self.history[forward ? 'push' : 'unshift'](song.id);

            ipcRenderer.send('update-history', {
                songs: self.playlist.songs.filter(e => self.history.includes(e.id)),
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

        self.playing = true;
        self.song = song;
        self.updateStatus();
        comments.getList(song);
        await self.resolveSong(song);
        await lastfm.playing(song);
    }

    @action async resolveSong() {
        // Cancel the previous request
        cancel && cancel();
        self.stop();

        var song = self.song;

        try {
            var response = await axios.get(
                `/api/player/song/${song.id}/${encodeURIComponent(helper.clearWith(song.name, ['（', '(']))}/${encodeURIComponent(song.artists.map(e => e.name).join(','))}/${preferences.highquality}?` + +new Date(),
                {
                    // Wait 60 secinds before timing out
                    timeout: 60000,
                    cancelToken: new CancelToken(c => {
                        // An executor function receives a cancel function as a parameter
                        cancel = c;
                    })
                }
            );
            var data = response.data.song;

            if (!data.src) {
                throw Error('Bad audio src.');
            }
        } catch (ex) {
            console.error(ex);

            if (
                [
                    'Bad audio src.',
                    'timeout of 10000ms exceeded'
                ].includes(ex.message)
            ) {
                self.tryTheNext();
            }
            return;
        }

        self.song = Object.assign({}, self.song, { data }, { waiting: false });
    }

    async tryTheNext() {
        var next = await self.next(false, false);

        // In FM mode the next song is null
        if (!next) return;

        if (next.id === self.song.id) {
            // Break dead loop
            self.playing = false;
            return;
        }

        upnext.toggle(next);
    }

    async next(loop = false, autoPlay = true) {
        var songs = self.playlist.songs.slice();
        var history = self.history;
        var index = history.indexOf(self.song.id);
        var next;

        switch (true) {
            // In the loop mode, manual shuffle immediate play the next song
            case loop === true
                    && self.mode === PLAYER_LOOP:
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

        try {
            if (autoPlay) {
                self.play(next);
                return;
            }
        } catch (ex) {
            // Anti-warnning
        }

        return songs.find(e => e.id === next);
    }

    async prev() {
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

    @action async toggle() {
        self.playing = !self.playing;

        // When player resume try to play the canceled song
        if (self.playing && upnext.canceled) {
            await self.play(upnext.canceled.id, false);
            // Reset the canceled item
            upnext.cancel(null);
        }

        self.updateStatus();
    }

    stop() {
        var audio = document.querySelector('audio');

        if (audio) {
            audio.pause();
            audio.src = '';
            audio.currentTime = 0;
        }
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

        self.updateStatus();
    }

    scrobble() {
        var songid = self.song.id;
        var sourceid = self.playlist.id;
        var time = self.song.duration;

        lastfm.scrobble(self.song);

        if (!preferences.scrobble) {
            return;
        }

        try {
            axios.get(`/api/player/scrobble/${songid}/${sourceid}/${Math.ceil(time / 1000)}`);
        } catch (ex) {
            // Anti warnning
        }
    }

    updateStatus() {
        ipcRenderer.send('update-status', {
            playing: self.playing,
            song: self.song,
            modes: MODES.map(
                e => {
                    return {
                        mode: e,
                        enabled: e === self.mode
                    };
                }
            )
        });
    }
}

const self = new Controller();
export { PLAYER_LOOP, PLAYER_SHUFFLE, PLAYER_REPEAT };
export default self;
