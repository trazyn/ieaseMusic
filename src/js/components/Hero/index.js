
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import clazz from 'classname';
import injectSheet from 'react-jss';

import classes from './classes';
import helper from 'utils/helper';
import ProgressImage from 'ui/ProgressImage';
import Indicator from 'ui/Indicator';

@inject(stores => ({
    like: stores.me.like,
    unlike: stores.me.unlike,
    isLiked: stores.me.isLiked,
    song: stores.controller.song,
    comments: stores.comments.total,
    showShare: stores.share.toggle,
}))
@observer
class Hero extends Component {
    render() {
        var { classes, song, isLiked, unlike, like, comments, showShare } = this.props;
        var pathname = this.props.location.pathname;
        var liked = isLiked(song.id);

        return (
            <div className={classes.container}>
                <ProgressImage
                    {...{
                        height: window.innerHeight,
                        width: window.innerHeight,
                        src: song.album.cover.replace(/100y100$/, '500y500'),
                    }}
                />

                <a
                    href=""
                    className={classes.share}
                    onClick={
                        e => {
                            e.preventDefault();
                            showShare(true);
                        }
                    }
                >
                    <i className="ion-android-share-alt" />
                </a>

                <summary>
                    <i
                        className={clazz('ion-ios-heart', {
                            [classes.liked]: liked,
                        })}
                        onClick={e => liked ? unlike(song) : like(song)}
                        style={{
                            cursor: 'pointer',
                            display: 'table',
                        }}
                    />

                    <span
                        className={classes.badge}
                    >
                        {
                            helper.getRate(song)
                        }
                    </span>

                    <span className={classes.badge}>
                        {
                            pathname === '/comments'
                                ? `${helper.humanNumber(comments)} Comments`
                                : 'Lyrics'
                        }
                    </span>
                </summary>

                <nav>
                    <article
                        className={
                            clazz({
                                [classes.active]: pathname === '/lyrics',
                            })
                        }
                    >
                        <Link
                            to={
                                `/${pathname === '/comments' ? 'lyrics' : 'comments'}`
                            }
                        >
                            {
                                pathname === '/comments'
                                    ? 'Lyrics'
                                    : `${helper.humanNumber(comments)} Comments`
                            }
                        </Link>
                    </article>

                    <article>
                        <Link to="/singleton">
                            Cover

                            <Indicator
                                style={{
                                    marginLeft: 28,
                                }}
                            />
                        </Link>
                    </article>
                </nav>

                <footer>
                    <h3>
                        {song.name}
                    </h3>

                    <p className={classes.author}>
                        {
                            song.artists.map(
                                (e, index) => {
                                    // Show the artist
                                    return (
                                        <Link
                                            key={index}
                                            to={e.link}
                                        >
                                            {e.name}
                                        </Link>
                                    );
                                }
                            )
                        }
                    </p>
                </footer>
            </div>
        );
    }
}

export default injectSheet(classes)(Hero);
