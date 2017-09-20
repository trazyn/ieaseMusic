
import React, { Component } from 'react';
import { Link } from 'react-router';
import { inject, observer } from 'mobx-react';
import injectSheet from 'react-jss';
import clazz from 'classname';

import classes from './classes';

@inject(stores => ({
    song: stores.controller.song,
    mode: stores.controller.mode,
    next: stores.controller.next,
    prev: stores.controller.prev,
    toggle: stores.controller.toggle,
    playing: stores.controller.playing,
    progress: stores.controller.progress,
    changeMode: stores.controller.changeMode,
    isLiked: stores.me.isLiked,
}))
@observer
class Controller extends Component {
    render() {
        var { classes, song, mode, prev, next, toggle, isLiked, playing, progress } = this.props;

        if (!song.id) {
            return false;
        }

        return (
            <div className={classes.container}>
                <div
                    className={classes.bar}
                    style={{
                        width: `${progress * 100}%`
                    }} />

                <section>
                    <Link to={song.album.link}>
                        <img
                            className={classes.cover}
                            src={song.album.cover} />
                    </Link>

                    <aside>
                        <div className={classes.info}>
                            <p className={classes.title}>
                                {song.name}
                            </p>

                            <p className={classes.author}>
                                {
                                    song.artists.map((e, index) => {
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
                        </div>

                        <div className={classes.action}>
                            <i className={clazz('ion-ios-heart', {
                                [classes.liked]: isLiked(song.id)
                            })} />

                            <i
                                className={clazz({
                                    'ion-ios-shuffle-strong': mode === 0,
                                    'ion-ios-infinite': mode === 1,
                                    'ion-ios-loop-strong': mode === 2,
                                })}
                                onClick={this.props.changeMode} />

                            <div className={classes.controls}>
                                <i
                                    className="ion-ios-rewind"
                                    onClick={prev} />

                                <span
                                    className={classes.toggle}
                                    onClick={toggle}>
                                    {
                                        playing
                                            ? <i className="ion-ios-pause" />
                                            : <i
                                                className="ion-ios-play"
                                                style={{
                                                    color: 'inherit'
                                                }} />
                                    }
                                </span>

                                <i
                                    className="ion-ios-fastforward"
                                    onClick={next}
                                    style={{
                                        marginRight: 0,
                                    }} />
                            </div>
                        </div>
                    </aside>
                </section>
            </div>
        );
    }
}

export default injectSheet(classes)(Controller);
