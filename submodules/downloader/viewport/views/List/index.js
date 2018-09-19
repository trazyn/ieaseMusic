
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import injectSheet from 'react-jss';

import classes from './classes';
import ProgressImage from 'ui/ProgressImage';

@inject('stores')
@observer
class List extends Component {
    componentDidMount() {
        this.props.stores.getPlaylist();
    }

    async clearAll() {
        var { removeTasks, tasks } = this.props.stores;
        var confirmed = await this.showConfirm();

        if (confirmed) {
            removeTasks(tasks);
        }
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

    render() {
        var { classes, stores: { playlist } } = this.props;

        return (
            <div className={classes.container}>
                <main>
                    <nav>
                        Close
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
                                        return (
                                            <div
                                                key={index}
                                                className={classes.item}
                                                style={{
                                                    marginBottom: index === playlist.length - 1 ? 24 : 0
                                                }}
                                            >
                                                <ProgressImage
                                                    {...{
                                                        width: 64,
                                                        src: e.album.cover.replace(/\?.*/, ''),
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
                        <button
                            onClick={e => this.downloadAll()}
                        >
                            <i className="ion-android-done-all" />
                            All
                        </button>

                        <button
                            onClick={e => this.downloadAll()}
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
