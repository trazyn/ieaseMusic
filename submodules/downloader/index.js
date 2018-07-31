
import fs from 'fs';
import path from 'path';
import { app, BrowserWindow, ipcMain, Notification, shell } from 'electron';
import windowStateKeeper from 'electron-window-state';
import nodeID3 from 'node-id3';
import tmp from 'tmp-promise';
import mkdirp from 'node-mkdirp';
import request from 'request';
import rp from 'request-progress';
import _debug from 'debug';

import pkg from '../../package.json';
import storage from '../../common/storage';

const _DOWNLOAD_DIR = path.join(app.getPath('music'), pkg.name);

let debug = _debug('dev:submodules:downloader');
let error = _debug('dev:submodules:downloader:error');
let downloader;

async function syncDownloaded() {
    try {
        var downloaded = await storage.get('tasks');

        debug(downloaded);

        if (!downloaded) {
            return;
        }

        Object.keys(downloaded).forEach(
            e => {
                debug('Check task: %s:%s', e.id, e.path);

                if (!e.id) {
                    throw Error('Invailid storage');
                }

                if (
                    false
                    || !e.path
                    || fs.existsSync(e.path) === false
                ) {
                    debug('Remove dead link: %s:%s', e.id, e.path);
                    delete downloaded[e.id];
                }
            }
        );

        storage.set('tasks', downloaded);
    } catch (ex) {
        error(ex);
        storage.remove('tasks');
    }
}

async function writeFile(url, filepath, cb) {
    debug('Write file: %s', filepath);

    var callback = state => {
        if (!state) {
            callback.size.transferred = callback.size.total;
            // eslint-disable-next-line
            return callback({ percent: 1, size: callback.size });
        }

        var { percent, size } = state;
        cb instanceof Function && cb(null, { progress: percent, size });
    };

    return new Promise((resolve, reject) => {
        try {
            rp(
                request({
                    url,
                    headers: {
                        'Origin': 'http://music.163.com',
                        'Referer': 'http://music.163.com/',
                    }
                })
            )
                .on('error',
                    err => {
                        throw err;
                    }
                )
                .on('progress',
                    state => {
                        callback(state);
                        callback.size = state.size;
                    }
                )
                .on('end',
                    // WTF? Why no state given??
                    // eslint-disable-next-line
                    () => (callback(), resolve())
                )
                .pipe(fs.createWriteStream(filepath))
            ;
        } catch (ex) {
            reject(ex);
        }
    });
}

async function download(task) {
    try {
        var song = task.payload;
        var src = song.data.src;
        var imagefile = (await tmp.file()).path;
        var trackfile = path.join(
            _DOWNLOAD_DIR,
            `${song.artists.map(e => e.name).join()} - ${song.name}.${src.replace(/\?.*/, '').match(/^http.*\.(.*)$/)[1]}`
        );
        var notificationOptions = {
            subtitle: song.name,
            body: song.artists.map(e => e.name).join(),
            closeButtonText: 'Done'
        };

        // Make sure the download directory already exists
        if (fs.existsSync(_DOWNLOAD_DIR) === false) {
            mkdirp.sync(_DOWNLOAD_DIR);
        }

        task.path = trackfile;

        await writeFile(
            src,
            trackfile,
            (err, data) => {
                if (err) {
                    failTask(task, err);
                    error(err);
                    return;
                }

                var { progress, size } = data;

                task.progress = progress;
                task.size = size.total;

                if (progress === 1) {
                    doneTask(task);
                } else {
                    updateTask(task);
                }
            }
        );
        await writeFile(song.album.cover.replace(/\?.*/, ''), imagefile);

        let tags = {
            title: song.name,
            artist: song.artists.map(e => e.name).join(),
            album: song.album.name,
            image: imagefile,
        };
        let success = nodeID3.write(tags, trackfile);

        if (!success) {
            throw Error('Failed to write ID3 tags: \'%s\'', trackfile);
        }

        let notification = new Notification({
            title: '🍉 Download Success~',
            ...notificationOptions,
        });

        notification.on('click', () => {
            shell.showItemInFolder(trackfile);
        });
        notification.show();
    } catch (ex) {
        error(ex);
        fs.unlink(trackfile);
        fs.unlink(imagefile);

        new Notification({
            title: '😕 Download Failed~',
            ...notificationOptions,
        }).show();
    }
}

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

    downloader.loadURL(`file://${__dirname}/viewport/index.html`);

    downloader.once('ready-to-show', () => {
        downloader.show();
    });

    // Download track
    ipcMain.on('download', (event, args) => {
        var song = JSON.parse(args.song);

        addTask(song);
    });

    syncDownloaded();
}

function failTask(task, err) {
    downloader.webContents.send(
        'download-failure',
        { task, err }
    );
}

function doneTask(task) {
    downloader.webContents.send(
        'download-success',
        { task }
    );
}

function updateTask(task) {
    downloader.webContents.send(
        'download-begin',
        { task }
    );
}

function addTask(item) {
    debug('Download song: \'%s\'', item.id);
    var task = {
        id: item.id,
        progress: 0,
        date: +new Date(),
        size: 0,
        path: null,
        payload: item,
    };

    download(task);
    downloader.webContents.send(
        'download-begin',
        { task }
    );
}

export default {
    createDownloader,
};
