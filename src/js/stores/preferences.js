
import { observable, action } from 'mobx';
import { ipcRenderer } from 'electron';

import controller from './controller';
import storage from 'utils/storage';

class Preferences {
    @observable showTray = true;
    @observable alwaysOnTop = true;
    @observable showNotification = true;
    @observable autoPlay = true;

    @action async init() {
        var preferences = await storage.get('preferences');
        var {
            showTray = self.showTray,
            alwaysOnTop = self.alwaysOnTop,
            showNotification = self.showNotification,
            autoPlay = self.autoPlay
        } = preferences;

        self.showTray = !!showTray;
        self.alwaysOnTop = !!alwaysOnTop;
        self.showNotification = !!showNotification;
        self.autoPlay = !!autoPlay;

        // Save preferences
        self.save();
    }

    @action async save() {
        var { showTray, alwaysOnTop, showNotification, autoPlay } = self;

        await storage.set('preferences', {
            showTray,
            alwaysOnTop,
            showNotification,
            autoPlay,
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
}

const self = new Preferences();
export default self;
