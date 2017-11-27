
import React, { Component } from 'react';
import { Link } from 'react-router';
import { inject, observer } from 'mobx-react';
import clazz from 'classname';
import injectSheet from 'react-jss';

import classes from './classes';
import helper from 'utils/helper';
import ProgressImage from 'ui/ProgressImage';

@inject(stores => ({
    like: stores.me.like,
    unlike: stores.me.unlike,
    isLiked: stores.me.isLiked,
    song: stores.controller.song,
    comments: stores.comments.total,
    isShowComments: stores.comments.show,
    showComments: () => {
        stores.comments.toggle(true);
        stores.lyrics.toggle(false);
    },
    isShowLyrics: stores.lyrics.show,
    showLyrics: () => {
        stores.lyrics.toggle(true);
        stores.comments.toggle(false);
    },
}))
@observer
class Hero extends Component {
    render() {
        var { classes, song, close, isLiked, unlike, like, comments, showComments, showLyrics, isShowComments, isShowLyrics } = this.props;
        var liked = isLiked(song.id);

        return (
            <div className={classes.container}>
                <ProgressImage {...{
                    height: window.innerHeight,
                    width: window.innerHeight,
                    src: song.album.cover.replace(/100y100$/, '500y500'),
                }} />

                <header>
                    <i
                        className={clazz('ion-ios-heart', {
                            [classes.liked]: liked,
                        })}
                        onClick={e => liked ? unlike(song) : like(song)}
                        style={{
                            cursor: 'pointer',
                        }} />

                    {
                        (song.data && song.data.isFlac) && (
                            <span
                                className={classes.highquality}
                                title="High Quality Music">
                                SQ
                            </span>
                        )
                    }
                </header>

                <section>
                    <p className={clazz({
                        [classes.active]: isShowComments,
                    })}>
                        <span onClick={e => showComments()}>
                            {helper.humanNumber(comments)} Comments
                        </span>
                    </p>

                    <p className={clazz({
                        [classes.active]: isShowLyrics,
                    })}>
                        <span onClick={e => showLyrics()}>
                            Lyrics
                        </span>
                    </p>
                </section>

                <footer>
                    <h3>{song.name}</h3>
                    <p className={classes.author}>
                        {
                            song.artists.map((e, index) => {
                                // Show the artist
                                return (
                                    <Link
                                        key={index}
                                        onClick={close}
                                        to={e.link}>
                                        {e.name}
                                    </Link>
                                );
                            })
                        }
                    </p>
                </footer>
            </div>
        );
    }
}

export default injectSheet(classes)(Hero);
