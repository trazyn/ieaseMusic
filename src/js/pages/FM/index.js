
import React, { Component } from 'react';
import { Link } from 'react-router';
import { inject, observer } from 'mobx-react';
import injectSheet from 'react-jss';

import classes from './classes';
import Loader from 'ui/Loader';
import FadeImage from 'ui/FadeImage';
import Header from 'components/Header';

@inject(stores => ({
    loading: stores.fm.loading,
    songs: stores.fm.songs,
    getSongs: stores.fm.getSongs,
}))
@observer
class FM extends Component {
    componentWillMount() {
        this.props.getSongs();
    }

    renderBG() {
        var { classes, songs } = this.props;

        return (
            <div className={classes.covers}>
                {
                    songs.map((e, index) => {
                        return (
                            <div className={classes.cover} key={index}>
                                <FadeImage src={e.album.cover} />
                            </div>
                        );
                    })
                }
            </div>
        );
    }

    render() {
        var { classes, loading, songs } = this.props;
        var song = songs[0];

        if (!song || loading) {
            return (
                <Loader show={true} />
            );
        }

        return (
            <div className={classes.container}>
                <Header {...{
                    showBack: true,
                }} />
                {this.renderBG()}

                <section className={classes.main}>
                    <article>
                        <FadeImage src={song.album.cover} />

                        <aside>
                            <p className={classes.title}>
                                <span title={song.name}>
                                    {song.name}
                                </span>
                            </p>
                            <p className={classes.artists}>
                                <span>
                                    {
                                        song.artists.map((e, index) => {
                                            return <Link to={e.link} key={index}>{e.name}</Link>;
                                        })
                                    }
                                </span>
                            </p>
                            <p className={classes.album}>
                                <span>
                                    <Link to={song.album.link} title={song.album.name}>
                                        {song.album.name}
                                    </Link>
                                </span>
                            </p>
                        </aside>
                    </article>

                    <div className={classes.progress}>
                        <div />
                    </div>

                    <div className={classes.controls}>
                        <i className="ion-ios-heart" />
                        <i className="ion-android-arrow-down" />
                        <i className="ion-ios-pause" />
                        <i className="ion-ios-fastforward" />
                    </div>
                </section>
            </div>
        );
    }
}

export default injectSheet(classes)(FM);
