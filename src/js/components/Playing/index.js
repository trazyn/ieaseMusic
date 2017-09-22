
import React, { Component } from 'react';
import { Link } from 'react-router';
import { inject, observer } from 'mobx-react';
import injectSheet from 'react-jss';
import clazz from 'classname';

import classes from './classes';
import FadeImage from 'ui/FadeImage';
import colors from 'utils/colors';

@inject(stores => ({
    show: stores.playing.show,
    songs: stores.controller.playlist.songs,
    song: stores.controller.song,
    play: stores.controller.play,
    close: () => stores.playing.toggle(false),
}))
@observer
class Playing extends Component {
    renderList() {
        var { classes, songs = [], song = {}, play, close } = this.props;

        return songs.map((e, index) => {
            return (
                <li
                    className={clazz(classes.song, {
                        [classes.playing]: e.id === song.id,
                    })}
                    key={index}
                    onClick={() => {
                        play(e.id);
                        close();
                    }}>
                    <Link to={e.album.link}>
                        <FadeImage src={e.album.cover} />
                    </Link>
                    <aside>
                        <p className={classes.title}>{e.name}</p>
                        <p className={classes.author}>
                            {
                                e.artists.map((e, index) => {
                                    return (
                                        <Link
                                            key={index}
                                            to={e.link}>
                                            {e.name}
                                        </Link>
                                    );
                                })
                            }
                        </p>
                    </aside>

                    <div
                        className={classes.mask}
                        style={{
                            background: colors.randomGradient(),
                        }} />
                </li>
            );
        });
    }

    render() {
        var { classes, show, close } = this.props;

        if (!show) {
            return false;
        }

        return (
            <div
                className={classes.container}
                ref="container">
                <div
                    className={classes.overlay}
                    onClick={close} />

                <section>
                    <header>
                        <input type="text" placeholder="Search..." ref="search" />

                        <img
                            alt="Close"
                            className={classes.close}
                            onClick={close}
                            src="assets/close.png" />
                    </header>

                    <ul className={classes.list}>
                        {this.renderList()}
                    </ul>
                </section>
            </div>
        );
    }
}

export default injectSheet(classes)(Playing);
