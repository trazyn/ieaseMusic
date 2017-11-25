
import { observable, action } from 'mobx';
import { ipcRenderer } from 'electron';
import axios from 'axios';

import controller from './controller';
import theme from '../../theme.js';
import config from '../../../config/index';
import storage from 'utils/storage';
import lastfm from 'utils/lastfm';

class Preferences {
    @observable showTray = true;
    @observable alwaysOnTop = true;
    @observable showNotification = true;
    @observable autoPlay = true;
    @observable naturalScroll = true;
    @observable volume = 1;
    @observable port = config.api.port;
    @observable highquality = 1;
    @observable lastfm = {
        username: '', // Your last.fm username
        password: '', // Your last.fm password
    };
    @observable connecting = false;

    @action async init() {
        var preferences = await storage.get('preferences');
        var {
            showTray = self.showTray,
            alwaysOnTop = self.alwaysOnTop,
            showNotification = self.showNotification,
            autoPlay = self.autoPlay,
            naturalScroll = self.naturalScroll,
            port = self.port,
            volume = self.volume,
            highquality = self.highquality,
            backgrounds = theme.playlist.backgrounds,
            lastfm = self.lastfm,
        } = preferences;

        self.showTray = !!showTray;
        self.alwaysOnTop = !!alwaysOnTop;
        self.showNotification = !!showNotification;
        self.autoPlay = !!autoPlay;
        self.naturalScroll = !!naturalScroll;
        self.port = port || config.api.port;
        self.volume = +volume || 1;
        self.highquality = +highquality || 0;
        self.backgrounds = backgrounds;
        self.lastfm = lastfm;

        // Save preferences
        self.save();
        axios.defaults.baseURL = `http://localhost:${self.port}`;

        return preferences;
    }

    @action async save() {
        var { showTray, alwaysOnTop, showNotification, autoPlay, naturalScroll, port, volume, highquality, backgrounds, lastfm } = self;

        await storage.set('preferences', {
            showTray,
            alwaysOnTop,
            showNotification,
            autoPlay,
            naturalScroll,
            port,
            volume,
            highquality,
            backgrounds,
            lastfm,
        });

        ipcRenderer.send('update-preferences', {
            playing: controller.playing,
            showTray,
            alwaysOnTop,
        });
    }

    @action setShowTray(showTray) {
        self.showTray = showTray;
        self.save();
    }

    @action setAlwaysOnTop(alwaysOnTop) {
        self.alwaysOnTop = alwaysOnTop;
        self.save();
    }

    @action setShowNotification(showNotification) {
        self.showNotification = showNotification;
        self.save();
    }

    @action setAutoPlay(autoPlay) {
        self.autoPlay = autoPlay;
        self.save();
    }

    @action setNaturalScroll(naturalScroll) {
        self.naturalScroll = naturalScroll;
        self.save();
    }

    @action setBackgrounds(backgrounds) {
        self.backgrounds = backgrounds;
        self.save();
    }

    @action setLastfm(lastfm) {
        self.lastfm = lastfm;
        self.save();
    }

    @action setVolume(volume) {
        self.volume = volume;
        self.save();
    }

    @action setHighquality(highquality) {
        self.highquality = highquality;
        self.save();
    }

    @action setPort(port) {
        if (port < 1000
            || port > 65535) {
            port = config.api.port;
        }

        self.port = port;
        self.save();
    }

    @action async connect() {
        var { username, password } = self.lastfm;

        self.connecting = true;

        var success = await lastfm.initialize(username, password);

        if (success) {
            self.setLastfm({
                username,
                password,
                connected: `${username}:${password}`,
            });
        }

        self.connecting = false;
    }
}

const self = new Preferences();
export default self;
