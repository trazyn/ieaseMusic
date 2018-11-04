
import path from 'path';
import { observable, action } from 'mobx';
import { remote, ipcRenderer } from 'electron';
import axios from 'axios';

import pkg from 'root/package.json';
import controller from './controller';
import config from 'config/index';
import theme from 'config/theme.js';
import storage from 'common/storage';
import lastfm from 'utils/lastfm';

class Preferences {
    @observable show = false;
    @observable showTray = false;
    @observable showMenuBarOnLinux = false;
    @observable revertTrayIcon = false;
    @observable alwaysOnTop = false;
    @observable showNotification = true;
    @observable autoPlay = true;
    @observable volume = 1;
    @observable port = config.api.port;
    @observable highquality = 0;
    @observable autoupdate = false;
    @observable lastfm = {
        username: '', // Your last.fm username
        password: '', // Your last.fm password
    };
    @observable connecting = false;
    @observable scrobble = true;
    @observable enginers = {
        'QQ': true,
        'MiGu': true,
        'Xiami': false,
        'Kugou': false,
        'Baidu': true,
        'kuwo': true,
    };
    @observable proxy = '';
    @observable downloads = path.join(remote.app.getPath('music'), pkg.name);

    @action async init() {
        var preferences = await storage.get('preferences');
        var {
            showTray = self.showTray,
            showMenuBarOnLinux = self.showMenuBarOnLinux,
            revertTrayIcon = self.revertTrayIcon,
            alwaysOnTop = self.alwaysOnTop,
            showNotification = self.showNotification,
            autoPlay = self.autoPlay,
            port = self.port,
            volume = self.volume,
            highquality = self.highquality,
            backgrounds = theme.playlist.backgrounds,
            autoupdate = self.autoupdate,
            scrobble = self.scrobble,
            lastfm = self.lastfm,
            enginers = self.enginers,
            proxy = self.proxy,
            downloads = self.downloads,
        } = preferences;

        self.showTray = !!showTray;
        self.showMenuBarOnLinux = !!showMenuBarOnLinux;
        self.revertTrayIcon = !!revertTrayIcon;
        self.alwaysOnTop = !!alwaysOnTop;
        self.showNotification = !!showNotification;
        self.autoPlay = !!autoPlay;
        self.port = port || config.api.port;
        self.volume = +volume || 1;
        self.highquality = +highquality || 0;
        self.backgrounds = backgrounds;
        self.autoupdate = autoupdate;
        self.scrobble = scrobble;
        self.lastfm = lastfm;
        self.enginers = enginers;
        self.proxy = proxy;
        self.downloads = downloads;

        // Save preferences
        self.save();
        axios.defaults.baseURL = `http://localhost:${self.port}`;

        return preferences;
    }

    @action async save() {
        var { showTray, showMenuBarOnLinux, revertTrayIcon, alwaysOnTop, showNotification, autoPlay, port, volume, highquality, backgrounds, autoupdate, scrobble, lastfm, enginers, proxy, downloads } = self;

        await storage.set('preferences', {
            showTray,
            showMenuBarOnLinux,
            revertTrayIcon,
            alwaysOnTop,
            showNotification,
            autoPlay,
            port,
            volume,
            highquality,
            backgrounds,
            autoupdate,
            scrobble,
            lastfm,
            enginers,
            proxy,
            downloads,
        });

        ipcRenderer.send('update-preferences', {
            playing: controller.playing,
            showTray,
            alwaysOnTop,
            proxy,
            revertTrayIcon
        });
    }

    @action setShowTray(showTray) {
        self.showTray = showTray;
        self.save();
    }

    @action setShowMenuBarOnLinux(showMenuBarOnLinux) {
        self.showMenuBarOnLinux = showMenuBarOnLinux;
        self.save();
    }

    @action setRevertTrayIcon(revertTrayIcon) {
        self.revertTrayIcon = revertTrayIcon;
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

    @action setScrobble(scrobble) {
        self.scrobble = scrobble;
        self.save();
    }

    @action setAutoupdate(autoupdate) {
        self.autoupdate = autoupdate;
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

    @action setDownloads(downloads) {
        self.downloads = downloads.path;
        self.save();
    }

    @action setProxy(proxy) {
        if (!/^http(s)?:\/\/\w+/i.test(proxy)) {
            proxy = '';
        }

        self.proxy = proxy;
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

    @action async setEnginers(enginers) {
        self.enginers = enginers;
        self.save();
    }
}

const self = new Preferences();
export default self;
