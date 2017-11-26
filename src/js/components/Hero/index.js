
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { inject, observer } from 'mobx-react';
import clazz from 'classname';
import injectSheet from 'react-jss';

import classes from './classes';
import ProgressImage from 'ui/ProgressImage';

@inject(stores => ({
    like: stores.me.like,
    unlike: stores.me.unlike,
    isLiked: stores.me.isLiked,
    song: stores.comments.song,
}))
@observer
class Comments extends Component {
    static propTypes = {
        close: PropTypes.func.isRequired,
    };

    render() {
        var { classes, song, close, isLiked, unlike, like } = this.props;
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
                        onClick={e => liked ? unlike(song) : like(song)} />
                </header>

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

export default injectSheet(classes)(Comments);
