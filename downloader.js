
import { BrowserWindow } from 'electron';
import windowStateKeeper from 'electron-window-state';

let downloader;

function createDownloader() {
    var mainWindowState = windowStateKeeper({
        defaultWidth: 800,
        defaultHeight: 520,
    });

    downloader = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        show: false,
        width: 360,
        height: 520,
        resizable: false,
        maximizable: false,
        fullscreenable: false,
        backgroundColor: 'none',
        titleBarStyle: 'hiddenInset',
    });

    downloader.loadURL(`file://${__dirname}/src/index.html#/downloader`);

    downloader.once('ready-to-show', () => {
        downloader.show();
    });

    downloader.on('close', () => {
        downloader = null;
    });
}

function addTask() {}

export {
    createDownloader,
    addTask,
};
