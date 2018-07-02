
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import injectSheet from 'react-jss';
import clazz from 'classname';

import classes from './classes';
import ProgressImage from 'ui/ProgressImage';

@inject(stores => ({
    song: stores.controller.song,
    like: stores.me.like,
    unlike: stores.me.unlike,
    isLiked: stores.me.isLiked,
    playing: stores.controller.playing,
}))
@observer
class Singleton extends Component {
    componentWillReceiveProps(nextProps) {
        var classes = this.props.classes;
        var ele = this.circle;

        if (!ele) return;

        ele = ele.firstElementChild;

        if (nextProps.playing) {
            ele.classList.remove(classes.pause);
        } else {
            ele.classList.add(classes.pause);
        }
    }

    render() {
        var { classes, song, isLiked, like, unlike } = this.props;
        var liked = isLiked(song.id);

        return (
            <div className={classes.container}>
                <header>
                    <i
                        className={clazz('ion-ios-heart', {
                            [classes.liked]: liked,
                        })}
                        onClick={e => liked ? unlike(song) : like(song)}
                        style={{
                            cursor: 'pointer',
                        }}
                    />

                    {
                        (song.data && song.data.isFlac) && (
                            <span
                                className={classes.highquality}
                                title="High Quality Music"
                            >
                                SQ
                            </span>
                        )
                    }
                </header>

                <img
                    alt="Close"
                    className={classes.close}
                    onClick={() => window.history.back()}
                    src="assets/close.png"
                />

                <main>
                    <ProgressImage
                        {...{
                            width: window.innerWidth,
                            src: song.album.cover.replace(/\?.*$/, ''),
                        }}
                    />

                    <div
                        className={classes.circle}
                        ref={
                            ele => (this.circle = ele)
                        }
                    >
                        <ProgressImage
                            {...{
                                width: 260,
                                height: 260,
                                src: song.album.cover.replace(/\?.*$/, '') + '?param=200y200',
                            }}
                        />
                    </div>
                </main>
            </div>
        );
    }
}

export default injectSheet(classes)(Singleton);
