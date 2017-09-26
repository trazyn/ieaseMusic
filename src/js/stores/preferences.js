
import { observable, action } from 'mobx';
import { ipcRenderer } from 'electron';

import storage from 'utils/storage';

class Preferences {
    @observable alwaysOnTop = true;
    @observable showNotification = true;
    @observable autoPlay = true;

    @action async init() {
        var preferences = await storage.get('preferences');
        var { alwaysOnTop, showNotification, autoPlay } = preferences;

        self.alwaysOnTop = !!alwaysOnTop;
        self.showNotification = !!showNotification;
        self.autoPlay = !!autoPlay;

        // Save preferences
        self.save();
    }

    @action async save() {
        var { alwaysOnTop, showNotification, autoPlay } = self;

        await storage.set('preferences', {
            alwaysOnTop,
            showNotification,
            autoPlay,
        });

        ipcRenderer.send('update-preferences', {
            alwaysOnTop,
        });
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
