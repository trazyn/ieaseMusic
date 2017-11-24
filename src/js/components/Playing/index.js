
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
    search: stores.playing.filter,
    filtered: stores.playing.filtered,
    songs: stores.controller.playlist.songs,
    song: stores.controller.song,
    play: stores.controller.play,
    close: () => stores.playing.toggle(false),
}))
@observer
class Playing extends Component {
    componentDidUpdate() {
        var { show, song } = this.props;

        if (show) {
            let playing = Array.from(
                this.refs.list.querySelectorAll('[data-id]')
            ).find(e => e.dataset.id === song.id);

            if (playing) {
                playing.scrollIntoView();
            }
        }
    }

    pressEscExit(e) {
        if (e.keyCode === 27) {
            this.props.close();
        }
    }

    highlight(offset) {
        var list = this.refs.list;
        var classes = this.props.classes;
        var songs = Array.from(list.querySelectorAll('li[data-id]'));
        var index = songs.findIndex(e => e.classList.contains(classes.active));

        if (index > -1) {
            songs[index].classList.remove(classes.active);
        }

        index += offset;

        if (index < 0) {
            // Fallback to the last element
            index = songs.length - 1;
        } else if (index > songs.length - 1) {
            // Fallback to the 1th element
            index = 0;
        }

        var active = songs[index];

        if (active) {
            // Keep active item always in the viewport
            active.classList.add(classes.active);
            list.scrollTop = active.offsetTop + active.offsetHeight - list.offsetHeight;
        }
    }

    navigation(e) {
        var keyCode = e.keyCode;
        var offset = {
            // Up
            '38': -1,
            // Down
            '40': +1,
        }[keyCode];

        if (offset) {
            this.highlight(offset);
        }

        if (keyCode !== 13) {
            return;
        }

        var active = this.refs.list.querySelector(`.${this.props.classes.active}`);

        if (active) {
            let songid = active.dataset.id;
            this.props.play(songid);
        }
    }

    renderList() {
        var { classes, songs = [], filtered, song = {}, play, close } = this.props;
        var list = songs;

        // Show the search result
        if (this.refs.search
            && this.refs.search.value.trim()) {
            list = filtered;
        }

        if (list.length === 0) {
            return (
                <li className={classes.nothing}>
                    Nothing ...
                </li>
            );
        }

        return list.map((e, index) => {
            return (
                <li
                    className={clazz(classes.song, {
                        [classes.playing]: e.id === song.id,
                    })}
                    data-id={e.id}
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
        var { classes, show, search, close } = this.props;

        if (!show) {
            return false;
        }

        return (
            <div
                className={classes.container}
                onKeyUp={e => this.pressEscExit(e)}
                ref="container"
                tabIndex="-1">
                <div
                    className={classes.overlay}
                    onClick={close} />

                <section>
                    <header>
                        <input
                            autoFocus={true}
                            onInput={e => search(e.target.value)}
                            onKeyUp={e => this.navigation(e)}
                            placeholder="Search..."
                            ref="search"
                            type="text" />

                        <img
                            alt="Close"
                            className={classes.close}
                            onClick={close}
                            src="assets/close.png" />
                    </header>

                    <ul
                        className={classes.list}
                        ref="list">
                        {this.renderList()}
                    </ul>
                </section>
            </div>
        );
    }
}

export default injectSheet(classes)(Playing);
