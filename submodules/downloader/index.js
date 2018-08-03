
import fs from 'fs';
import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import windowStateKeeper from 'electron-window-state';
import nodeID3 from 'node-id3';
import tmp from 'tmp-promise';
import mkdirp from 'node-mkdirp';
import request from 'request';
import rp from 'request-progress';
import _debug from 'debug';

import pkg from '../../package.json';
import storage from '../../common/storage';

const KEY = 'downloaded';
const _DOWNLOAD_DIR = path.join(app.getPath('music'), pkg.name);

let debug = _debug('dev:submodules:downloader');
let error = _debug('dev:submodules:downloader:error');
let downloader;
let cancels = {};

async function syncDownloaded() {
    try {
        var downloaded = await storage.get(KEY);

        debug(downloaded);

        if (!downloaded) {
            return;
        }

        Object.keys(downloaded).forEach(
            e => {
                var task = downloaded[e];
                debug('Check task: %s:%s', task.id, task.path);

                if (!task.id) {
                    throw Error('Invailid storage');
                }

                if (
                    false
                    || !task.path
                    || fs.existsSync(task.path) === false
                ) {
                    debug('Remove dead link: %s:%s', task.id, task.path);
                    delete downloaded[task.id];
                }
            }
        );

        storage.set(KEY, downloaded);
    } catch (ex) {
        error(ex);
        storage.remove(KEY);
    }
}

async function writeFile(url, filepath, cb, canceler) {
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
            var r = request({
                url,
                headers: {
                    'Origin': 'http://music.163.com',
                    'Referer': 'http://music.163.com/',
                }
            });

            rp(r)
                .on('error',
                    err => {
                        delete cancels[canceler];
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
                    () => {
                        callback();
                        resolve();

                        delete cancels[canceler];
                    }
                )
                .pipe(fs.createWriteStream(filepath))
            ;

            if (canceler) {
                cancels[canceler] = () => r.abort();
            }
        } catch (ex) {
            reject(ex);
        }
    });
}

async function download(task) {
    try {
        var preferences = await storage.get('preferences');
        var song = task.payload;
        var src = song.data.src;
        var imagefile = (await tmp.file()).path;
        var trackfile = path.join(
            preferences.downloads || _DOWNLOAD_DIR,
            `${song.artists.map(e => e.name).join()} - ${song.name.replace(/\/|\\/g, '／')}.${src.replace(/\?.*/, '').match(/^http.*\.(.*)$/)[1]}`
        );

        // Make sure the download directory already exists
        if (fs.existsSync(_DOWNLOAD_DIR) === false) {
            mkdirp.sync(_DOWNLOAD_DIR);
        }

        task.path = trackfile;

        // Tell the render downlaod has started
        updateTask(task);

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
            },
            song.id
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
    } catch (ex) {
        error(ex);
        fs.unlink(trackfile);
        fs.unlink(imagefile);
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

    downloader.once('ready-to-show', downloader.show);

    // Download track
    ipcMain.on('download',
        (event, args) => {
            var song = JSON.parse(args.song);

            addTask(song);
        }
    );

    // Remove track
    ipcMain.on('download-remove',
        (event, args) => {
            removeTasks(JSON.parse(args.tasks));
        }
    );

    syncDownloaded();
}

function removeTasks(tasks) {
    tasks = Array.isArray(tasks) ? tasks : [tasks];

    tasks.forEach(
        e => {
            debug('Remove file: %s:%s', e.id, e.path);
            var canceler = cancels[e.id];

            // Kill the ongoing task
            if (canceler instanceof Function) {
                canceler();
            }

            try {
                fs.unlinkSync(e.path);
            } catch (ex) {}
        }
    );
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
