
import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, hashHistory } from 'react-router';
import { Provider } from 'mobx-react';
import { ipcRenderer, remote, shell } from 'electron';
import { ThemeProvider } from 'react-jss';

import './global.css';
import 'utils/albumColors';
import theme from './theme';
import getRoutes from './js/routes';
import stores from './js/stores';

class App extends Component {
    componentDidMount() {
        var { controller, fm, me, menu, playing } = stores;
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
            this.refs.navigator.router.push('/');
        });

        ipcRenderer.on('show-top', () => {
            this.refs.navigator.router.push('/top');
        });

        ipcRenderer.on('show-playlist', () => {
            this.refs.navigator.router.push('/playlist');
        });

        ipcRenderer.on('show-fm', () => {
            this.refs.navigator.router.push('/fm');
        });

        ipcRenderer.on('show-menu', () => {
            menu.toggle(true);
        });

        ipcRenderer.on('show-playing', () => {
            playing.toggle(true);
        });

        window.addEventListener('contextmenu', e => {
            var { controller, fm } = stores;
            var menu = new remote.Menu.buildFromTemplate([
                {
                    label: controller.playing ? 'Pause' : 'Play',
                    click() {
                        controller.toggle();
                    }
                },
                {
                    label: 'Next',
                    click() {
                        isFMPlaying() ? fm.next() : controller.next();
                    }
                },
                {
                    label: 'Previous',
                    click() {
                        controller.prev();
                    }
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Like',
                    click() {
                        if (me.likes.get(controller.song.id)) {
                            return;
                        }
                        me.like(controller.song);
                    }
                },
                {
                    label: 'Ban',
                    click() {
                        fm.ban(controller.song.id);
                    }
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Preferences...',
                    click() {
                        // TODO
                    },
                },
                {
                    type: 'separator',
                },
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
                    label: '💕 Follow me on Twitter 👏',
                    click() {
                        shell.openExternal('https://twitter.com/var_darling');
                    }
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Goodbye 😘',
                    click() {
                        ipcRenderer.send('goodbye');
                    }
                },
            ]);

            menu.popup(remote.getCurrentWindow());
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
