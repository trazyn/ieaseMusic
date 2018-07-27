
import fs from 'fs';
import path from 'path';
import { app, BrowserWindow, Menu, Tray, globalShortcut, ipcMain, shell, powerMonitor, Notification } from 'electron';
import windowStateKeeper from 'electron-window-state';
import storage from 'electron-json-storage';
import axios from 'axios';
import nodeID3 from 'node-id3';
import tmp from 'tmp-promise';
import mkdirp from 'node-mkdirp';
import rp from 'request-promise-native';
import _debug from 'debug';

import pkg from './package.json';
import config from './config';
import api from './server/api';
import usocket from './server/usocket';
import { installAutoUpdater, checkForUpdates } from './autoUpdater';

const _PLATFORM = process.platform;
const _DOWNLOAD_DIR = path.join(app.getPath('music'), pkg.name);

let debug = _debug('dev:main');
let error = _debug('dev:main:error');
let apiServer;
let forceQuit = false;
let quitting = false;
let menu;
let tray;
let mainWindow;
let isOsx = _PLATFORM === 'darwin';
let isLinux = _PLATFORM === 'linux';
// Shared data to other applocation via a unix socket file
let shared = {
    modes: [],
    track: {},
    playing: false,
    playlist: []
};
let mainMenu = [
    {
        label: 'ieaseMusic',
        submenu: [
            {
                label: `About ieaseMusic`,
                selector: 'orderFrontStandardAboutPanel:',
            },
            {
                label: 'Preferences...',
                accelerator: 'Cmd+,',
                click() {
                    mainWindow.webContents.send('show-preferences');
                }
            },
            {
                type: 'separator'
            },
            {
                role: 'hide'
            },
            {
                role: 'hideothers'
            },
            {
                role: 'unhide'
            },
            {
                type: 'separator'
            },
            {
                label: 'Check for updates',
                accelerator: 'Cmd+U',
                click() {
                    checkForUpdates();
                }
            },
            {
                label: 'Quit',
                accelerator: 'Command+Q',
                selector: 'terminate:',
                click() {
                    goodbye();
                }
            }
        ]
    },
    {
        label: 'Controls',
        submenu: [
            {
                label: 'Pause',
                accelerator: 'Space',
                click() {
                    mainWindow.show();
                    mainWindow.webContents.send('player-toggle');
                }
            },
            {
                label: 'Next',
                accelerator: 'Right',
                click() {
                    mainWindow.show();
                    mainWindow.webContents.send('player-next');
                }
            },
            {
                label: 'Previous',
                accelerator: 'Left',
                click() {
                    mainWindow.show();
                    mainWindow.webContents.send('player-previous');
                }
            },
            {
                label: 'Increase Volume',
                accelerator: 'Up',
                click() {
                    mainWindow.show();
                    mainWindow.webContents.send('player-volume-up');
                }
            },
            {
                label: 'Decrease Volume',
                accelerator: 'Down',
                click() {
                    mainWindow.show();
                    mainWindow.webContents.send('player-volume-down');
                }
            },
            {
                label: 'Like',
                accelerator: 'Cmd+L',
                click() {
                    mainWindow.show();
                    mainWindow.webContents.send('player-like');
                }
            },
        ],
    },
    {
        label: 'Recently Played',
        submenu: [
            {
                label: 'Nothing...',
            }
        ],
    },
    {
        label: 'Next Up',
        submenu: [
            {
                label: 'Nothing...',
            }
        ],
    },
    {
        label: 'Edit',
        submenu: [
            {
                role: 'undo'
            },
            {
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                role: 'cut'
            },
            {
                role: 'copy'
            },
            {
                role: 'paste'
            },
            {
                role: 'pasteandmatchstyle'
            },
            {
                role: 'delete'
            },
            {
                role: 'selectall'
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Home',
                accelerator: 'Cmd+Shift+H',
                click() {
                    mainWindow.webContents.send('show-home');
                }
            },
            {
                label: 'Search',
                accelerator: 'Cmd+F',
                click() {
                    mainWindow.webContents.send('show-search');
                }
            },
            {
                label: 'Top podcasts',
                accelerator: 'Cmd+Shift+T',
                click() {
                    mainWindow.webContents.send('show-top');
                }
            },
            {
                label: 'Playlist',
                accelerator: 'Cmd+Shift+P',
                click() {
                    mainWindow.webContents.send('show-playlist');
                }
            },
            {
                label: 'Made For You',
                accelerator: 'Cmd+Shift+F',
                click() {
                    mainWindow.webContents.send('show-fm');
                }
            },
            {
                type: 'separator',
            },
            {
                label: 'Menu',
                accelerator: 'Cmd+Shift+L',
                click() {
                    mainWindow.webContents.send('show-menu');
                }
            },
            {
                label: 'Next Up',
                accelerator: 'Cmd+P',
                click() {
                    mainWindow.webContents.send('show-playing');
                }
            },
            {
                type: 'separator'
            },
            {
                role: 'toggledevtools'
            },
        ]
    },
    {
        role: 'window',
        submenu: [
            {
                role: 'minimize'
            },
            {
                role: 'close'
            }
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Bug report 🐛',
                click() {
                    shell.openExternal('https://github.com/trazyn/ieaseMusic/issues');
                }
            },
            {
                label: 'Fork me on Github 🚀',
                click() {
                    shell.openExternal('https://github.com/trazyn/ieaseMusic');
                }
            },
            {
                type: 'separator'
            },
            {
                label: '💕 Follow me on Twitter 👏',
                click() {
                    shell.openExternal('https://twitter.com/var_darling');
                }
            }
        ]
    }
];
let trayMenu = [
    {
        label: 'Pause',
        click() {
            mainWindow.webContents.send('player-toggle');
        }
    },
    {
        label: 'Next',
        click() {
            mainWindow.webContents.send('player-next');
        }
    },
    {
        label: 'Previous',
        click() {
            mainWindow.webContents.send('player-previous');
        }
    },
    {
        type: 'separator'
    },
    {
        label: 'Preferences...',
        accelerator: 'Cmd+,',
        click() {
            mainWindow.webContents.send('show-preferences');
        }
    },
    {
        type: 'separator'
    },
    {
        label: 'Toggle main window',
        click() {
            let isVisible = mainWindow.isVisible();
            isVisible ? mainWindow.hide() : mainWindow.show();
        }
    },
    {
        type: 'separator'
    },
    {
        label: 'Check for updates',
        accelerator: 'Cmd+U',
        click() {
            checkForUpdates();
        }
    },
    {
        label: 'Fork me on Github',
        click() {
            shell.openExternal('https://github.com/trazyn/ieaseMusic');
        }
    },
    {
        type: 'separator'
    },
    {
        label: 'Toggle DevTools',
        accelerator: 'Alt+Command+I',
        click() {
            mainWindow.show();
            mainWindow.toggleDevTools();
        }
    },
    {
        type: 'separator'
    },
    {
        label: 'Quit',
        accelerator: 'Command+Q',
        selector: 'terminate:',
        click() {
            goodbye();
        }
    }
];
let dockMenu = [
    {
        label: 'Toggle Player',
        accelerator: 'Space',
        click() {
            mainWindow.show();
            mainWindow.webContents.send('player-toggle');
        }
    },
    {
        label: 'Next',
        accelerator: 'Right',
        click() {
            mainWindow.show();
            mainWindow.webContents.send('player-next');
        }
    },
    {
        label: 'Previous',
        accelerator: 'Left',
        click() {
            mainWindow.show();
            mainWindow.webContents.send('player-previous');
        }
    },
    {
        label: 'Like',
        accelerator: 'Cmd+L',
        click() {
            mainWindow.show();
            mainWindow.webContents.send('player-like');
        }
    },
];

function updateMenu(playing) {
    if (!isOsx) {
        return;
    }

    mainMenu[1]['submenu'][0]['label'] = playing ? 'Pause' : 'Play';
    menu = Menu.buildFromTemplate(mainMenu);

    Menu.setApplicationMenu(menu);
}

function updateTray(playing) {
    // Update unread mesage count
    trayMenu[0].label = playing ? 'Pause' : 'Play';

    let contextmenu = Menu.buildFromTemplate(trayMenu);
    let icon = playing
        ? `${__dirname}/src/assets/playing.png`
        : `${__dirname}/src/assets/notplaying.png`
        ;

    if (!tray) {
        // Init tray icon
        tray = new Tray(icon);

        tray.on('right-click', () => {
            tray.popUpContextMenu();
        });
    }

    tray.setImage(icon);
    tray.setContextMenu(contextmenu);
}

function registerGlobalShortcut() {
    // Play the next song
    globalShortcut.register('MediaNextTrack', e => {
        mainWindow.webContents.send('player-next');
    });

    // Play the previous song
    globalShortcut.register('MediaPreviousTrack', e => {
        mainWindow.webContents.send('player-previous');
    });

    // Toggle the player
    globalShortcut.register('MediaPlayPause', e => {
        mainWindow.webContents.send('player-toggle');
    });
}

async function getCookies() {
    return new Promise((resolve, reject) => {
        mainWindow.webContents.session.cookies.get(
            {},
            (err, cookies) => {
                if (err) {
                    return resolve();
                }

                resolve(cookies.map(e => `${e.name}=${e.value}`).join('; '));
            }
        );
    });
}

async function writeFile(url, filepath) {
    var cookies = await getCookies();
    var file = fs.createWriteStream(filepath);

    return new Promise((resolve, reject) => {
        try {
            rp({
                url,
                headers: {
                    'Cookie': cookies,
                    'Origin': 'http://music.163.com',
                    'Referer': 'http://music.163.com/',
                }
            }).pipe(file);

            file.on('finish', () => {
                file.end();
                resolve();
            });
            file.on('error', err => {
                throw err;
            });
        } catch (ex) {
            reject(ex);
        }
    });
}

async function download(song) {
    try {
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

        await writeFile(src, trackfile);
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

const goodbye = () => {
    forceQuit = true;
    app.quit();
};

const createMainWindow = () => {
    var mainWindowState = windowStateKeeper({
        defaultWidth: 800,
        defaultHeight: 520,
    });

    mainWindow = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        show: false,
        width: 800,
        height: 520,
        resizable: false,
        maximizable: false,
        fullscreenable: false,
        backgroundColor: 'none',
        titleBarStyle: 'hiddenInset',
    });

    if (isLinux) {
        mainWindow.setIcon(
            path.join(__dirname, 'src/assets/dock.png')
        );
        // Disable default menu bar
        mainWindow.setMenu(null);
    }

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

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('close', e => {
        if (isLinux) {
            app.quit();
            return;
        }

        if (forceQuit) {
            app.quit();
        } else {
            e.preventDefault();
            mainWindow.hide();
        }
    });

    // Update the history menu
    ipcMain.on('update-history', (event, args) => {
        var historyMenu = mainMenu.find(e => e.label === 'Recently Played');
        var submenu = args.songs.map((e, index) => {
            return {
                label: e.name,
                accelerator: `Cmd+${index}`,
                click() {
                    mainWindow.show();
                    mainWindow.webContents.send('player-play', {
                        id: e.id,
                    });
                }
            };
        });

        historyMenu.submenu = submenu;
        updateMenu();
    });

    // Update next up menu
    ipcMain.on('update-playing', async(event, args) => {
        var playingMenu = mainMenu.find(e => e.label === 'Next Up');
        var submenu = args.songs.map((e, index) => {
            return {
                label: e.name,
                click() {
                    mainWindow.show();
                    mainWindow.webContents.send('player-play', {
                        id: e.id,
                    });
                }
            };
        });

        shared.playlist = args.songs;
        playingMenu.submenu = submenu;
        updateMenu();
    });

    // Update menu icon image and controls menu
    ipcMain.on('update-status', (event, args) => {
        var { playing, song, modes } = args;

        if (tray) {
            updateTray(playing, song);
        }

        shared.modes = modes;
        shared.track = song;
        shared.playing = +playing;
        updateMenu(playing);
    });

    // Show/Hide menu icon
    ipcMain.on('update-preferences', (event, args = {}) => {
        mainWindow.setAlwaysOnTop(!!args.alwaysOnTop);
        mainWindow.webContents.session.setProxy(
            {
                proxyRules: args.proxy,
                proxyBypassRules: 'localhost'
            },
            () => debug('Apply proxy: %s', args.proxy)
        );

        if (!args.showTray) {
            if (tray) {
                tray.destroy();
                tray = null;
            }

            return;
        }

        updateTray(args.playing);
    });

    // Download track
    ipcMain.on('download', (event, args) => {
        download(JSON.parse(args.song));
    });

    // Show the main window
    ipcMain.on('show', event => {
        mainWindow.show();
        mainWindow.focus();
    });

    // Minimize the window
    ipcMain.on('minimize', event => {
        mainWindow.minimize();
    });

    // Quit app
    ipcMain.on('goodbye', () => goodbye());

    // App has suspend
    powerMonitor.on('suspend', () => {
        mainWindow.webContents.send('player-pause');
    });

    if (isOsx) {
        // App about
        app.setAboutPanelOptions({
            applicationName: 'ieaseMusic',
            applicationVersion: pkg.version,
            copyright: 'Made with 💖 by trazyn. \n https://github.com/trazyn/ieaseMusic',
            credits: `With the invaluable help of: \n github.com/Binaryify/NeteaseCloudMusicApi`,
            version: pkg.version
        });
        app.dock.setIcon(`${__dirname}/src/assets/dock.png`);
        app.dock.setMenu(Menu.buildFromTemplate(dockMenu));
    }

    mainWindow.goodbye = () => goodbye();

    updateMenu();
    registerGlobalShortcut();
    usocket(shared, mainWindow);
    installAutoUpdater(() => goodbye());
    mainWindow.webContents.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.1.2 Safari/603.3.8');
    debug('Create main process success 🍻');
};

app.setName('ieaseMusic');

app.on('activate', e => {
    if (!mainWindow.isVisible()) {
        mainWindow.show();
    }
});
app.on('before-quit', e => {
    e.preventDefault();

    if (quitting) {
        return;
    }

    apiServer && apiServer.close();

    // Fix issues #14
    forceQuit = true;
    quitting = true;
    mainWindow = null;

    app.exit(0);
    process.exit(0);
});
app.on('ready', () => {
    createMainWindow();

    storage.get('preferences', (err, data) => {
        var port = config.api.port;

        if (!err) {
            port = data.port || port;

            checkForUpdates(data.autoupdate);
        }

        axios.defaults.baseURL = `http://localhost:${port}`;

        apiServer = api.listen(port, (err) => {
            if (err) throw err;

            debug(`API server is running with port ${port} 👊`);
        });
    });
});
