
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import injectSheet from 'react-jss';
import { ipcRenderer } from 'electron';
import clazz from 'classname';

import classes from './classes';
import ProgressImage from 'ui/ProgressImage';

@inject('stores')
@observer
class List extends Component {
    componentDidMount() {
        this.props.stores.getPlaylist();
    }

    renderDetail(song) {
        var { classes } = this.props;
        var name = song.name;
        var artists = song.artists.map((e, index) => e.name).join();

        return (
            <aside>
                <p className={classes.title}>
                    {name}
                </p>

                <small style={{ marginTop: -4 }}>
                    {artists}
                </small>
            </aside>
        );
    }

    toggleAll(checked) {
        var { playlist, isPersistence } = this.props.stores;

        playlist.forEach(
            e => {
                var persistence = isPersistence(e);

                if (!persistence) {
                    e.checked = !checked;
                }
            }
        );
    }

    close() {
        var songs = this.props.stores.playlist.filter(e => e.checked);

        window.history.back();
        ipcRenderer.send('download', { songs: JSON.stringify(songs) });
    }

    addDownloadTasks() {
        this.close();
    }

    render() {
        var { classes, stores: { playlist, isPersistence } } = this.props;
        var checked = playlist.filter(e => e.checked).length;

        return (
            <div className={classes.container}>
                <main>
                    <nav>
                        <i
                            className={clazz('ion-ios-close-empty', classes.close)}
                            onClick={() => this.close()}
                        />
                    </nav>

                    <section>
                        {
                            playlist.length === 0
                                ? (
                                    <div className={classes.nothing}>
                                        <span>Nothing ...</span>
                                    </div>
                                )
                                : playlist.map(
                                    (e, index) => {
                                        var persistence = isPersistence(e);

                                        return (
                                            <div
                                                key={index}
                                                className={classes.item}
                                                onClick={ev => {
                                                    if (persistence) {
                                                        return;
                                                    }
                                                    e.checked = !e.checked;
                                                }}
                                            >
                                                <ProgressImage
                                                    {...{
                                                        width: 32,
                                                        src: e.album.cover.replace(/\?.*/, ''),
                                                        className: classes.cover,
                                                    }}
                                                />

                                                {
                                                    this.renderDetail(e)
                                                }

                                                {
                                                    persistence
                                                        ? <i className="ion-ios-cloud-download" />
                                                        : (
                                                            e.checked
                                                                ? <i className="ion-ios-checkmark" />
                                                                : <i className="ion-ios-checkmark-outline" />
                                                        )
                                                }
                                            </div>
                                        );
                                    }
                                )
                        }
                    </section>

                    <footer>
                        <button
                            onClick={e => this.toggleAll(checked)}
                            className={
                                clazz({
                                    [classes.checked]: checked === playlist.length
                                })
                            }
                        >
                            <i className="ion-android-done-all" />
                            All
                        </button>

                        <small className={classes.counter}>
                            {checked} / {playlist.length}
                        </small>

                        <button
                            onClick={e => this.addDownloadTasks()}
                            disabled={!checked}
                        >
                            OK
                        </button>
                    </footer>
                </main>
            </div>
        );
    }
}

export default injectSheet(classes)(List);
