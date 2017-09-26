
import { app, BrowserWindow, Menu, Tray, ipcMain, shell } from 'electron';
import windowStateKeeper from 'electron-window-state';
import _debug from 'debug';

import pkg from './package.json';
import config from './config';
import api from './server/api';

let debug = _debug('dev:main');
let forceQuit = false;
let menu;
let tray;
let mainWindow;
let isOsx = process.platform === 'darwin';
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
                label: 'Quit',
                accelerator: 'Command+Q',
                selector: 'terminate:',
                click() {
                    forceQuit = true;
                    mainWindow = null;
                    app.quit();
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
                accelerator: 'Cmd+Right',
                click() {
                    mainWindow.show();
                    mainWindow.webContents.send('player-next');
                }
            },
            {
                label: 'Previous',
                accelerator: 'Cmd+Left',
                click() {
                    mainWindow.show();
                    mainWindow.webContents.send('player-previous');
                }
            },
            {
                label: 'Increase Volume',
                accelerator: 'Cmd+Up',
                click() {
                    mainWindow.show();
                    mainWindow.webContents.send('player-volume-up');
                }
            },
            {
                label: 'Decrease Volume',
                accelerator: 'Cmd+Down',
                click() {
                    mainWindow.show();
                    mainWindow.webContents.send('player-volume-up');
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
                label: 'Show Home',
                accelerator: 'Cmd+Shift+H',
                click() {
                    mainWindow.webContents.send('show-home');
                }
            },
            {
                label: 'Show TOP',
                accelerator: 'Cmd+Shift+T',
                click() {
                    mainWindow.webContents.send('show-top');
                }
            },
            {
                label: 'Show Playlist',
                accelerator: 'Cmd+Shift+P',
                click() {
                    mainWindow.webContents.send('show-playlist');
                }
            },
            {
                label: 'Show FM',
                accelerator: 'Cmd+Shift+F',
                click() {
                    mainWindow.webContents.send('show-fm');
                }
            },
            {
                role: 'separator',
            },
            {
                label: 'Menu',
                accelerator: 'Cmd+M',
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
                role: 'separator'
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
            forceQuit = true;
            mainWindow = null;
            app.quit();
        }
    }
];

function updateMenu(playing) {
    mainMenu[1]['submenu'][0]['label'] = playing ? 'Pause' : 'Play';
    menu = Menu.buildFromTemplate(mainMenu);

    if (isOsx) {
        Menu.setApplicationMenu(null);
        Menu.setApplicationMenu(menu);
    }
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
        resizable: false,
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

        playingMenu.submenu = submenu;
        updateMenu();
    });

    ipcMain.on('update-status', (event, args) => {
        var { playing, song } = args;

        updateMenu(playing);
        updateTray(playing, song);
    });

    ipcMain.on('update-preferences', (event, args) => {
        mainWindow.setAlwaysOnTop(!!args.alwaysOnTop);
    });

    ipcMain.on('show', event => {
        mainWindow.show();
        mainWindow.focus();
    });

    ipcMain.on('goodbye', (event) => {
        forceQuit = true;
        mainWindow = null;
        app.quit();
    });

    if (isOsx) {
        app.setAboutPanelOptions({
            applicationName: 'ieaseMusic',
            applicationVersion: pkg.version,
            copyright: 'Made with 💖 by trazyn. \n https://github.com/trazyn/ieaseMusic',
            credits: `With the invaluable help of: \n github.com/Binaryify/NeteaseCloudMusicApi`,
            version: pkg.version
        });
    }

    updateMenu();
    updateTray();

    mainWindow.webContents.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.1.2 Safari/603.3.8');
    debug('Create main process success 🍻');
};

app.setName('ieaseMusic');
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
