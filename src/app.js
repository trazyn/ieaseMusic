
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { ipcRenderer, remote, shell } from 'electron';
import 'ionicons201/css/ionicons.css';

import 'app/global.css';
import 'utils/albumColors';
import { PLAYER_REPEAT, PLAYER_SHUFFLE, PLAYER_LOOP } from 'stores/controller';
import getRoutes from './js/routes';
import stores from './js/stores';

class App extends Component {
    componentDidMount() {
        var { preferences, controller, fm, me, menu, playing } = stores;
        var navigator = this.navigator;
        var isFMPlaying = () => controller.playlist.id === fm.playlist.id;

        function togglePreferences() {
            preferences.show = !preferences.show;
        }

        function toggleLike() {
            var song = controller.song;

            if (me.likes.get(song.id)) {
                me.unlike(song);
                return;
            }
            me.like(song);
        }

        // Player play
        ipcRenderer.on('player-play', (e, args) => {
            controller.play(args.id);
        });

        // Toggle the player
        ipcRenderer.on('player-toggle', () => {
            // Ignore signal
            if (navigator.history.location.pathname === '/search' || playing.show) {
                return;
            }

            controller.toggle();
        });

        // Pause the player when system suspend
        ipcRenderer.on('player-pause', () => {
            if (controller.playing) {
                controller.toggle();
            }
        });

        // Play the next song
        ipcRenderer.on('player-next', () => {
            let FMPlaying = isFMPlaying();

            if (FMPlaying) {
                fm.next();
            } else {
                controller.next();
            }
        });

        // Play previous song
        ipcRenderer.on('player-previous', () => {
            controller.prev();
        });

        // Like a song
        ipcRenderer.on('player-like', () => toggleLike());

        // Change player mode
        ipcRenderer.on('player-mode', (e, args) => {
            controller.changeMode(args.mode);
        });

        // Go the home screen
        ipcRenderer.on('show-home', () => {
            navigator.history.push('/');
        });

        // Search
        ipcRenderer.on('show-search', () => {
            navigator.history.push('/search');
        });

        // Show the Ranking list
        ipcRenderer.on('show-top', () => {
            navigator.history.push('/top');
        });

        // All playlists
        ipcRenderer.on('show-playlist', () => {
            navigator.history.push('/playlist/全部');
        });

        // Show personal FM channel
        ipcRenderer.on('show-fm', () => {
            navigator.history.push('/fm');
        });

        // Show preferences screen
        ipcRenderer.on('show-preferences', () => {
            togglePreferences();
        });

        // SHow slide menu panel
        ipcRenderer.on('show-menu', () => {
            menu.toggle(true);
        });

        // Show the next up
        ipcRenderer.on('show-playing', () => {
            playing.toggle(true);
        });

        // Get the playlist
        ipcRenderer.on('request-playlist', () => {
            let downloader = remote.getGlobal('downloader');

            if (downloader) {
                downloader.webContents.send('response-playlist', JSON.stringify(controller.playlist));
            }
        });

        // Right click menu
        window.addEventListener('contextmenu', e => {
            let logined = me.hasLogin();
            let contextmenu = new remote.Menu.buildFromTemplate([
                {
                    label: controller.playing ? 'Pause' : 'Play',
                    click: () => {
                        controller.toggle();
                    }
                },
                {
                    label: 'Next',
                    click: () => {
                        isFMPlaying() ? fm.next() : controller.next();
                    }
                },
                {
                    label: 'Previous',
                    click: () => {
                        controller.prev();
                    }
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Menu',
                    click: () => {
                        menu.toggle(true);
                    }
                },
                {
                    label: 'Next Up',
                    click: () => {
                        playing.toggle(true);
                    }
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Like/Unlike 💖',
                    enabled: logined,
                    click: () => toggleLike()
                },
                {
                    label: 'Ban 💩',
                    enabled: logined && controller.playlist.id === 'PERSONAL_FM',
                    click: () => {
                        fm.ban(controller.song.id);
                    }
                },
                {
                    label: 'Download 🍭',
                    click: () => {
                        ipcRenderer.send('download', { songs: JSON.stringify(controller.song) });
                    }
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Repeat 🤘',
                    type: 'checkbox',
                    checked: controller.mode === PLAYER_LOOP,
                    click: () => {
                        if (controller.mode === PLAYER_LOOP) {
                            controller.changeMode(PLAYER_REPEAT);
                        } else {
                            controller.changeMode(PLAYER_LOOP);
                        }
                    }
                },
                {
                    label: 'Shuffle ⚡️',
                    type: 'checkbox',
                    checked: controller.mode === PLAYER_SHUFFLE,
                    enabled: !isFMPlaying(),
                    click: () => {
                        controller.changeMode(PLAYER_SHUFFLE);
                    }
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Preferences...',
                    click: () => {
                        togglePreferences();
                    },
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Home',
                    click: () => {
                        navigator.history.push('/');
                    }
                },
                {
                    label: 'Search',
                    click: () => {
                        navigator.history.push('/search');
                    }
                },
                {
                    label: 'Playlist',
                    click: () => {
                        navigator.history.push('/playlist/全部');
                    }
                },
                {
                    label: 'Made For You',
                    click: () => {
                        navigator.history.push('/fm');
                    }
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Show Comments 💬',
                    click: () => {
                        navigator.history.push('/comments');
                    }
                },
                {
                    label: 'Show Lyrics 🎤',
                    click: () => {
                        navigator.history.push('/lyrics');
                    }
                },
                {
                    label: 'Show Cover 💅',
                    click: () => {
                        navigator.history.push('/cover');
                    }
                },
                {
                    label: 'Show Downloads 🚚',
                    click: () => {
                        ipcRenderer.send('download-show');
                    }
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Minimize 👇',
                    click: () => {
                        ipcRenderer.send('minimize');
                    }
                },
                {
                    label: 'Goodbye 😘',
                    click: () => {
                        ipcRenderer.send('goodbye');
                    }
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Bug report 🐛',
                    click: () => {
                        shell.openExternal('https://github.com/trazyn/ieaseMusic/issues');
                    }
                },
                {
                    label: 'Fork me on Github 🚀',
                    click: () => {
                        shell.openExternal('https://github.com/trazyn/ieaseMusic');
                    }
                },
                {
                    label: '💕 Follow me on Twitter 👏',
                    click: () => {
                        shell.openExternal('https://twitter.com/var_darling');
                    }
                },
            ]);

            contextmenu.popup(remote.getCurrentWindow(), {
                async: true,
            });
        });
    }

    render() {
        return (
            <Provider {...stores}>
                <HashRouter
                    ref={
                        ele => (this.navigator = ele)
                    }
                >
                    {getRoutes()}
                </HashRouter>
            </Provider>
        );
    }
}

export default hot(module)(App);
