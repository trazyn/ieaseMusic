
import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, hashHistory } from 'react-router';
import { Provider } from 'mobx-react';
import { ipcRenderer, remote, shell } from 'electron';
import { ThemeProvider } from 'react-jss';

import './global.css';
import 'utils/albumColors';
import { PLAYER_SHUFFLE, PLAYER_LOOP } from 'stores/controller';
import theme from './theme';
import getRoutes from './js/routes';
import stores from './js/stores';

class App extends Component {
    componentDidMount() {
        var { controller, fm, me, menu, playing } = stores;
        var navigator = this.refs.navigator;
        var isFMPlaying = () => controller.playlist.id === fm.playlist.id;

        ipcRenderer.on('player-play', (e, args) => {
            controller.play(args.id);
        });

        ipcRenderer.on('player-toggle', () => {
            controller.toggle();
        });

        ipcRenderer.on('player-next', () => {
            let FMPlaying = isFMPlaying();

            if (FMPlaying) {
                fm.next();
            } else {
                controller.next();
            }
        });

        ipcRenderer.on('player-previous', () => {
            controller.prev();
        });

        ipcRenderer.on('player-like', () => {
            var song = controller.song;

            if (me.likes.get(song.id)) {
                return;
            }

            me.like(controller.song);
        });

        ipcRenderer.on('show-home', () => {
            navigator.router.push('/');
        });

        ipcRenderer.on('show-top', () => {
            navigator.router.push('/top');
        });

        ipcRenderer.on('show-playlist', () => {
            navigator.router.push('/playlist/全部');
        });

        ipcRenderer.on('show-fm', () => {
            navigator.router.push('/fm');
        });

        ipcRenderer.on('show-preferences', () => {
            navigator.router.push('/preferences');
        });

        ipcRenderer.on('show-menu', () => {
            menu.toggle(true);
        });

        ipcRenderer.on('show-playing', () => {
            playing.toggle(true);
        });

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
                    label: 'Like 💖',
                    enabled: logined,
                    click: () => {
                        if (me.likes.get(controller.song.id)) {
                            return;
                        }
                        me.like(controller.song);
                    }
                },
                {
                    label: 'Ban 💩',
                    enabled: logined,
                    click: () => {
                        fm.ban(controller.song.id);
                    }
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Repeat 🤘',
                    type: 'radio',
                    checked: controller.mode === PLAYER_LOOP,
                    click: () => {
                        controller.changeMode(PLAYER_LOOP);
                    }
                },
                {
                    label: 'Shuffle ⚡️',
                    type: 'radio',
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
                        navigator.router.push('/preferences');
                    },
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Home',
                    click: () => {
                        navigator.router.push('/');
                    }
                },
                {
                    label: 'Playlist',
                    click: () => {
                        navigator.router.push('/playlist/全部');
                    }
                },
                {
                    label: 'FM',
                    click: () => {
                        navigator.router.push('/fm');
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
                <Router
                    history={hashHistory}
                    ref="navigator">
                    {getRoutes()}
                </Router>
            </Provider>
        );
    }
}

render(
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>,
    document.getElementById('root')
);
