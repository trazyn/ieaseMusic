
import fs from 'fs';
import path from 'path';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import windowStateKeeper from 'electron-window-state';
import nodeID3 from 'node-id3';
import tmp from 'tmp-promise';
import mkdirp from 'mkdirp';
import request from 'request';
import rp from 'request-progress';
import _debug from 'debug';

import pkg from '../../package.json';
import storage from '../../common/storage';
import config from '../../config';
import helper from '../../src/js/utils/helper';

const KEY = 'downloaded';
const MUSIC_DIR = app.getPath('music') || app.getPath('home');
const DOWNLOAD_DIR = path.join(MUSIC_DIR, pkg.name);

let debug = _debug('dev:submodules:downloader');
let error = _debug('dev:submodules:downloader:error');
let downloader;
let cancels = {};
let queue = createQueue(2);

function createQueue(max) {
    var waitingGroup = [];
    var mapping = {};
    var queue = {
        waiting(task) {
            return new Promise(
                (resolve, reject) => {
                    // Save the resolve callback
                    mapping[task.id] = () => resolve();
                    // Add to queue
                    waitingGroup.push(task);

                    if (waitingGroup.length <= max) {
                        resolve();
                    }
                }
            );
        },
        done(task) {
            mapping[task.id]();
            delete mapping[task.id];

            waitingGroup = waitingGroup.filter(e => e.id !== task.id);

            // Resolve the next task
            let next = waitingGroup.pop();
            if (next) {
                mapping[next.id]();
            }
        },
        flush() {
            // Reset the waiting group
            waitingGroup = [];
        },
    };

    return queue;
}

function isDev() {
    return process.mainModule.filename.indexOf('app.asar') === -1;
}

async function getDownloads() {
    var preferences = await storage.get('preferences');
    var downloads = preferences.downloads || DOWNLOAD_DIR;

    // Make sure the download directory already exists
    if (fs.existsSync(downloads) === false) {
        debug('Ccreate download directory: %s', downloads);
        mkdirp.sync(downloads);
    }

    return downloads;
}

async function getDownloadLink(song) {
    var downloadLink = (song.data || {}).src;

    return new Promise(
        (resolve, reject) => {
            if (downloadLink) {
                resolve(downloadLink);
                return;
            }

            var url = `/api/player/song/${song.id}/${encodeURIComponent(helper.clearWith(song.name, ['（', '(']))}/${encodeURIComponent(song.artists.map(e => e.name).join(','))}/1`;

            request(
                {
                    url: `http://localhost:${config.api.port}${url}`,
                    json: true,
                    timeout: 10000,
                },
                (err, response, data) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    if (!data.song.src) {
                        reject(new Error('404'));
                        return;
                    }

                    resolve(data.song.src);
                }
            );
        }
    );
}

async function syncDownloaded() {
    try {
        var downloaded = await storage.get(KEY);

        if (!downloaded) {
            return;
        }

        Object.keys(downloaded).forEach(
            e => {
                var task = downloaded[e];
                debug('Check task: %s => %s', task.id, task.path);

                if (!task.id) {
                    throw Error('Invailid storage');
                }

                // Keep the failed tasks
                if (task.success === false) {
                    return;
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
            return callback({ percent: 1, size: callback.size || 0 });
        }

        var { percent, size } = state;
        cb instanceof Function && cb(null, { progress: percent, size });
    };

    return new Promise((resolve, reject) => {
        var r = request({
            url,
            headers: {
                'Origin': 'http://music.163.com',
                'Referer': 'http://music.163.com/',
            },
            timeout: 10000,
        });

        rp(r)
            .on('error',
                err => {
                    delete cancels[canceler];

                    // https://github.com/request/request/blob/a92e138d897d78ce19dd70bd1ad271c7f9c6a23d/request.js#L1167
                    if (r._aborted) {
                        reject(new Error('_aborted'));
                    } else {
                        reject(err);
                    }
                }
            )
            .on('progress',
                state => {
                    callback.size = state.size || {};
                    callback(state);
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
    });
}

async function download(task) {
    await queue.waiting(task);

    // Mark task as processed
    task.waiting = false;

    try {
        var downloads = await getDownloads();
        var song = task.payload;
        var src = await getDownloadLink(song);
        var imagefile = (await tmp.file()).path;
        var trackfile = path.join(
            downloads,
            `${song.artists.map(e => e.name).join()} - ${song.name.replace(/\/|\\/g, '／')}.${src.replace(/\?.*/, '').match(/^http.*\.(.*)$/)[1]}`
        );

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

        queue.done(task);

        if (!success) {
            throw Error('Failed to write ID3 tags: \'%s\'', trackfile);
        }
    } catch (ex) {
        error(ex);

        if (ex.message === '_aborted') {
            // Download task has been canceled
            return;
        }

        queue.done(task);
        failTask(task, ex);
        fs.unlink(trackfile);
        fs.unlink(imagefile);
    }
}

function showDownloader() {
    syncTask();
    downloader.show();
    downloader.focus();
}

function createDownloader() {
    if (downloader) {
        showDownloader();
    }

    var mainWindowState = windowStateKeeper({
        defaultWidth: 360,
        defaultHeight: 520,
    });

    downloader = new BrowserWindow({
        x: mainWindowState.x + 800,
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

    downloader.on('close',
        event => {
            event.preventDefault();
            downloader.hide();
        }
    );
    downloader.loadURL(`file://${__dirname}/${isDev() ? 'viewport/index.html' : 'src/downloader.html'}`);

    // Download track
    ipcMain.on('download',
        (event, args) => {
            var songs = JSON.parse(args.songs);

            songs = Array.isArray(songs) ? songs : [songs];
            addTasks(songs);
        }
    );

    // Remove track
    ipcMain.on('download-remove',
        (event, args) => {
            removeTasks(JSON.parse(args.tasks));
        }
    );

    // Show the download window
    ipcMain.on('download-show',
        () => showDownloader()
    );

    // Open the downloads
    ipcMain.on('download-open',
        async() => {
            var downloads = await getDownloads();
            shell.openItem(downloads);
        }
    );

    syncDownloaded();
    global.downloader = downloader;
}

function removeTasks(tasks) {
    tasks = Array.isArray(tasks) ? tasks : [tasks];

    queue.flush();

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
    syncTask();
}

function failTask(task, err) {
    task.success = false;
    downloader.webContents.send(
        'download-failed',
        { task, err }
    );
}

function doneTask(task) {
    task.success = true;
    downloader.webContents.send(
        'download-success',
        { task }
    );
}

function updateTask(task) {
    downloader.webContents.send(
        'download-progress',
        { task }
    );
}

function syncTask(id) {
    downloader.webContents.send('download-sync', { id });
}

function addTasks(songs) {
    var tasks = [];

    songs.map(
        e => {
            debug('Download song: \'%s\'', e.id);
            var task = {
                id: e.id,
                progress: 0,
                date: +new Date(),
                size: 0,
                path: null,
                waiting: true,
                payload: e,
            };

            tasks.push(task);
        }
    );

    downloader.webContents.send(
        'download-begin',
        { tasks }
    );

    tasks.map(e => download(e));
}

export default {
    createDownloader,
    showDownloader,
};
