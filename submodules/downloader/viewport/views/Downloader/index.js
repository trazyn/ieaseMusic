
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import injectSheet from 'react-jss';
import delegate from 'delegate';
import { ipcRenderer } from 'electron';

import classes from './classes';
import ProgressImage from 'ui/ProgressImage';
import colors from 'utils/colors';

@inject('stores')
@observer
class Downloader extends Component {
    state = {
        selected: 'all',
    }

    highlight() {
        var classes = this.props.classes;
        var selected = this.state.selected;
        var eles = this.navs.children;

        Array.from(eles).map(
            e => {
                var key = e.dataset.index;

                if (key !== selected) {
                    e.style.background = '';
                    e.classList.remove(classes.selected);
                    return;
                }

                e.style.background = colors.randomGradient();
                e.classList.add(classes.selected);
            }
        );
    }

    componentDidMount() {
        var { stores: { load, updateTask, doneTask, failTask } } = this.props;

        delegate(
            this.navs, 'a[data-index]', 'click',
            e => {
                e.preventDefault();
                this.setState({ selected: e.target.dataset.index });
            }
        );

        ipcRenderer.on('download-begin', (e, args) => {
            updateTask(args.task);
        });

        ipcRenderer.on('download-progress', (e, args) => {
            updateTask(args.task);
        });

        ipcRenderer.on('download-success', (e, args) => {
            doneTask(args.task);
        });

        ipcRenderer.on('download-failure', (e, args) => {
            failTask(args.task, args.err);
        });

        load();
    }

    render() {
        var { classes, stores: { tasks } } = this.props;

        return (
            <div className={classes.container}>
                <nav
                    ref={ele => {
                        if (!ele) return;

                        this.navs = ele;
                        this.highlight();
                    }}
                >
                    <a data-index="all">All</a>
                    <a data-index="inProgress">In Progress</a>
                    <a data-index="done">Done</a>
                </nav>

                <section>
                    {
                        tasks.map(
                            (e, index) => {
                                var song = e.payload;
                                var title = `${song.name} - ${song.artists.map((e, index) => e.name).join()}`;

                                return (
                                    <div
                                        key={index}
                                        className={classes.item}
                                        style={{
                                            marginBottom: index === tasks.length - 1 ? 24 : 0
                                        }}
                                    >
                                        <ProgressImage
                                            {...{
                                                width: 64,
                                                src: song.album.cover.replace(/\?.*/, ''),
                                                className: classes.cover,
                                            }}
                                        />

                                        <aside>
                                            <span className={classes.title}>
                                                {title}
                                            </span>

                                            <div className={classes.progress}>
                                                <div
                                                    className={classes.passed}
                                                    style={{
                                                        width: `${e.progress * 100}%`,
                                                    }}
                                                />
                                            </div>
                                        </aside>
                                    </div>
                                );
                            }
                        )
                    }
                </section>

                <footer>
                    <button
                        onClick={
                            e => {
                                // TODO:
                            }
                        }
                    >
                        <i className="ion-android-open" />
                        Open Folder
                    </button>

                    <button
                        onClick={
                            e => {
                                // TODO:
                            }
                        }
                    >
                        <i className="ion-ios-close" />
                        Clear All
                    </button>
                </footer>
            </div>
        );
    }
}

export default injectSheet(classes)(Downloader);
