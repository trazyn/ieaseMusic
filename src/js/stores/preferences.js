
import { observable, action } from 'mobx';
import { ipcRenderer } from 'electron';
import axios from 'axios';

import controller from './controller';
import theme from '../../theme.js';
import config from '../../../config/index';
import storage from 'utils/storage';

class Preferences {
    @observable showTray = true;
    @observable alwaysOnTop = true;
    @observable showNotification = true;
    @observable autoPlay = true;
    @observable naturalScroll = true;
    @observable volume = 1;
    @observable port = config.api.port;

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
            backgrounds = theme.playlist.backgrounds,
        } = preferences;

        self.showTray = !!showTray;
        self.alwaysOnTop = !!alwaysOnTop;
        self.showNotification = !!showNotification;
        self.autoPlay = !!autoPlay;
        self.naturalScroll = !!naturalScroll;
        self.port = port || config.api.port;
        self.volume = +volume || 1;
        self.backgrounds = backgrounds;

        // Save preferences
        self.save();
        axios.defaults.baseURL = `http://localhost:${self.port}`;
    }

    @action async save() {
        var { showTray, alwaysOnTop, showNotification, autoPlay, naturalScroll, port, volume, backgrounds } = self;

        await storage.set('preferences', {
            showTray,
            alwaysOnTop,
            showNotification,
            autoPlay,
            naturalScroll,
            port,
            volume,
            backgrounds,
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

    @action setVolume(volume) {
        self.volume = volume;
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
}

const self = new Preferences();
export default self;
