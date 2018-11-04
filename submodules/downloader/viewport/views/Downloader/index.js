
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import injectSheet from 'react-jss';
import { Link } from 'react-router-dom';
import delegate from 'delegate';
import moment from 'moment';
import { ipcRenderer, shell } from 'electron';

import classes from './classes';
import Confirm from 'ui/Confirm';
import ProgressImage from 'ui/ProgressImage';

function humanSize(size) {
    var value = (size / 1024).toFixed(1);

    if (size > (1024 << 10)) {
        value = (value / 1024).toFixed(1);
        return `${value} M`;
    } else {
        return `${value} KB`;
    }
};

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
                    e.classList.remove(classes.selected);
                    return;
                }

                e.classList.add(classes.selected);
            }
        );
    }

    componentDidMount() {
        var { stores: { load, batchTask, updateTask, doneTask } } = this.props;

        delegate(
            this.navs, 'a[data-index]', 'click',
            e => {
                e.preventDefault();
                this.setState({ selected: e.target.dataset.index });
            }
        );

        ipcRenderer.removeAllListeners('download-sync');
        ipcRenderer.on('download-sync',
            (e, args) => {
                // Reload downloaded items from disk
                load();
            }
        );

        ipcRenderer.removeAllListeners('download-begin');
        ipcRenderer.on('download-begin',
            (e, args) => {
                let songs = args.tasks.map(
                    e => e.payload
                );
                batchTask(args.tasks);

                if (songs.length === 1) {
                    let song = songs[0];

                    let notification = new window.Notification('🍭 Donwload Track', {
                        icon: song.album.cover,
                        body: `${song.name} - ${song.artists.map(e => e.name).join(' / ')}`,
                    });

                    notification.onclick = () => {
                        ipcRenderer.send('download-show');
                    };
                } else {
                    if (songs.length === 0) {
                        return;
                    }

                    // eslint-disable-next-line
                    new window.Notification('🍭 Donwload Track', {
                        body: `${songs.length} download tasks in queue~`
                    });
                }
            }
        );

        ipcRenderer.removeAllListeners('download-progress');
        ipcRenderer.on('download-progress',
            (e, args) => {
                updateTask(args.task);
            }
        );

        ipcRenderer.removeAllListeners('download-success');
        ipcRenderer.on('download-success',
            (e, args) => {
                let song = args.task.payload;
                let notification = new window.Notification('🍉 Download Success~', {
                    icon: song.album.cover,
                    body: `${song.name} - ${song.artists.map(e => e.name).join(' / ')}`,
                });

                notification.onclick = () => {
                    shell.showItemInFolder(args.task.path);
                };
                doneTask(args.task);
            }
        );

        ipcRenderer.removeAllListeners('download-failed');
        ipcRenderer.on('download-failed',
            (e, args) => {
                let song = args.task.payload;

                // eslint-disable-next-line
                new window.Notification('😕 Download Failed~', {
                    icon: song.album.cover,
                    body: `${song.name} - ${song.artists.map(e => e.name).join(' / ')}`,
                });
                doneTask(args.task);
                updateTask(args.task);
            }
        );

        load();
    }

    async openDownloads(e) {
        e.preventDefault();
        ipcRenderer.send('download-open');
    }

    async clearAll() {
        var { removeTasks, tasks } = this.props.stores;
        var confirmed = await this.showConfirm();

        tasks = Array.from(tasks.values());

        if (confirmed) {
            removeTasks(tasks);
            ipcRenderer.send('download-remove', { tasks: JSON.stringify(tasks) });
        }
    }

    renderDetail(task) {
        var { classes, stores: { removeTasks } } = this.props;
        var song = task.payload;
        var name = song.name;
        var artists = song.artists.map((e, index) => e.name).join();

        if (task.waiting === true) {
            return (
                <aside>
                    <p className={classes.title}>
                        {name}
                    </p>

                    <small style={{ marginTop: -6 }}>
                        {artists}
                    </small>

                    <small>
                        {
                            moment(task.date).fromNow()
                        }
                    </small>
                    <div className={classes.actions}>
                        <small>Waiting...</small>
                    </div>
                </aside>
            );
        }

        if (task.progress === 1) {
            return (
                <aside>
                    <p className={classes.title}>
                        {name}
                    </p>

                    <small style={{ marginTop: -6 }}>
                        {artists}
                    </small>

                    <small>
                        {
                            moment(task.date).fromNow()
                        }
                    </small>
                    <div className={classes.hovers}>
                        {
                            humanSize(task.size)
                        }

                        <a
                            href=""
                            onClick={
                                e => {
                                    e.preventDefault();
                                    removeTasks(task);
                                    ipcRenderer.send('download-remove', { tasks: JSON.stringify(task) });
                                }
                            }
                        >
                            <i className="ion-trash-b" />
                        </a>
                    </div>
                </aside>
            );
        }

        if (task.success === false) {
            return (
                <aside>
                    <p className={classes.title}>
                        {name}
                    </p>

                    <small style={{ marginTop: -6 }}>
                        {artists}
                    </small>

                    <small>
                        {
                            moment(task.date).fromNow()
                        }
                    </small>
                    <div className={classes.actions}>
                        <button
                            onClick={e => ipcRenderer.send('download', { songs: JSON.stringify(song) })}
                        >
                            Retry
                        </button>

                        <button
                            onClick={e => removeTasks(task)}
                        >
                            Remove
                        </button>
                    </div>
                </aside>
            );
        }

        return (
            <aside>
                <span className={classes.title}>
                    {name} - {artists}
                </span>

                <div className={classes.progress}>
                    <div
                        className={classes.passed}
                        style={{
                            width: `${task.progress * 100}%`,
                        }}
                    />
                </div>
            </aside>
        );
    }

    render() {
        var { classes, stores: { tasks } } = this.props;

        tasks = Array.from(tasks.values());
        tasks = tasks.filter(
            e => {
                switch (this.state.selected) {
                    case 'all':
                        return true;

                    case 'inProgress':
                        return e.progress !== 1;

                    case 'done':
                        return e.progress === 1;
                }
            }
        );

        return (
            <div className={classes.container}>
                <main>
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
                            tasks.length === 0
                                ? (
                                    <div className={classes.nothing}>
                                        <span>Nothing ...</span>
                                    </div>
                                )
                                : tasks.map(
                                    (e, index) => {
                                        var song = e.payload;

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

                                                {
                                                    this.renderDetail(e)
                                                }
                                            </div>
                                        );
                                    }
                                )
                        }
                    </section>

                    <footer>
                        <aside>
                            <button
                                onClick={e => this.openDownloads(e)}
                            >
                                <i className="ion-android-open" />
                                Open Folder
                            </button>

                            <button
                                onClick={e => this.clearAll()}
                            >
                                <i className="ion-ios-close" />
                                Clear All
                            </button>
                        </aside>

                        <Link
                            to="/list"
                            style={{
                                marginRight: 10,
                                fontSize: 18,
                            }}
                        >
                            <i className="ion-ios-plus-outline" />
                        </Link>
                    </footer>
                </main>

                <Confirm
                    showConfirm={hook => (this.showConfirm = hook)}
                />
            </div>
        );
    }
}

export default injectSheet(classes)(Downloader);
