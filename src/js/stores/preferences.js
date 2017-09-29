
import { observable, action } from 'mobx';
import { ipcRenderer } from 'electron';

import controller from './controller';
import theme from '../../theme.js';
import storage from 'utils/storage';

class Preferences {
    @observable showTray = true;
    @observable alwaysOnTop = true;
    @observable showNotification = true;
    @observable autoPlay = true;
    @observable naturalScroll = true;

    @action async init() {
        var preferences = await storage.get('preferences');
        var {
            showTray = self.showTray,
            alwaysOnTop = self.alwaysOnTop,
            showNotification = self.showNotification,
            autoPlay = self.autoPlay,
            naturalScroll = self.naturalScroll,
            backgrounds = theme.playlist.backgrounds,
        } = preferences;

        self.showTray = !!showTray;
        self.alwaysOnTop = !!alwaysOnTop;
        self.showNotification = !!showNotification;
        self.autoPlay = !!autoPlay;
        self.naturalScroll = !!naturalScroll;
        self.backgrounds = backgrounds;

        // Save preferences
        self.save();
    }

    @action async save() {
        var { showTray, alwaysOnTop, showNotification, autoPlay, naturalScroll, backgrounds } = self;

        await storage.set('preferences', {
            showTray,
            alwaysOnTop,
            showNotification,
            autoPlay,
            naturalScroll,
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
}

const self = new Preferences();
export default self;
