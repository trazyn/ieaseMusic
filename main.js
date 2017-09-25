
import fs from 'fs';
import { app, powerMonitor, BrowserWindow, ipcMain, shell } from 'electron';
import windowStateKeeper from 'electron-window-state';
import _debug from 'debug';

import pkg from './package.json';
import config from './config';
import api from './server/api';

let debug = _debug('dev:main');
let forceQuit = false;
let mainWindow;
let isSuspend = false;
let userData = app.getPath('userData');
let imagesCacheDir = `${userData}/images`;
let voicesCacheDir = `${userData}/voices`;

const createMainWindow = () => {
    var mainWindowState = windowStateKeeper({
        defaultWidth: 740,
        defaultHeight: 480,
    });

    mainWindow = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: 740,
        height: 480,
        resize: false,
        vibrancy: 'medium-light',
        backgroundColor: 'none',
        frame: false,
    });

    mainWindow.loadURL(`file://${__dirname}/src/index.html`);

    mainWindow.webContents.on('did-finish-load', () => {
        try {
            mainWindow.show();
            mainWindow.focus();
        } catch (ex) { }
    });

    mainWindow.webContents.on('new-window', (event, url) => {
        event.preventDefault();
        shell.openExternal(url);
    });

    mainWindow.on('close', e => {
        if (forceQuit) {
            mainWindow = null;
            app.quit();
        } else {
            e.preventDefault();
            mainWindow.hide();
        }
    });

    ipcMain.on('is-suspend', (event, args) => {
        event.returnValue = isSuspend;
    });

    powerMonitor.on('resume', () => {
        isSuspend = false;
        mainWindow.webContents.send('os-resume');
    });

    [imagesCacheDir, voicesCacheDir].map(e => {
        if (!fs.existsSync(e)) {
            fs.mkdirSync(e);
        }
    });

    mainWindow.webContents.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.1.2 Safari/603.3.8');

    debug('Create main process success 🍻');
};

app.setName(pkg.name);
app.dock.setIcon(`${__dirname}/src/assets/dock.png`);

app.on('ready', createMainWindow);
app.on('before-quit', () => {
    // Fix issues #14
    forceQuit = true;
});
app.on('activate', e => {
    if (!mainWindow.isVisible()) {
        mainWindow.show();
    }
});

api.listen(config.api.port, (err) => {
    if (err) throw err;

    debug(`API server is running with port ${config.api.port} 👊`);
});
