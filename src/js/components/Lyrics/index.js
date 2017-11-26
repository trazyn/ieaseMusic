
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import injectSheet from 'react-jss';

import classes from './classes';
import ProgressImage from 'ui/ProgressImage';
import Loader from 'ui/Loader';
import Hero from 'components/Hero';

@inject(stores => ({
    close: () => stores.lyrics.toggle(false),
    loading: stores.lyrics.loading,
    getLyrics: () => stores.lyrics.getLyrics(),
    lyrics: stores.lyrics.list,
    song: stores.controller.song,
}))
@observer
class Lyrics extends Component {
    componentWillMount() {
        this.props.getLyrics();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.song.id !== nextProps.song.id) {
            this.props.getLyrics();
        }
    }

    render() {
        var { classes, loading, lyrics, song, close } = this.props;

        if (loading || !song.id) {
            return <Loader show={true} />;
        }

        return (
            <div className={classes.container}>
                <img
                    alt="Close"
                    className={classes.close}
                    onClick={close}
                    src="assets/close.png" />

                <Hero close={close} />

                <aside
                    className={classes.lyrics}
                    id="lyrics">
                    <ProgressImage {...{
                        height: window.innerHieght,
                        width: window.innerHieght,
                        src: song.album.cover.replace(/\?.*$/, ''),
                    }} />

                    <section>
                        <div style={{
                            position: 'relative',
                            paddingTop: '10vh',
                            paddingBottom: '14vh',
                        }}>
                            {
                                Object.keys(lyrics).map((e, index) => {
                                    return (
                                        <p
                                            data-times={e}
                                            key={index}>
                                            <span>
                                                {lyrics[e]}
                                            </span>
                                        </p>
                                    );
                                })
                            }
                        </div>
                    </section>
                </aside>
            </div>
        );
    }
}

export default injectSheet(classes)(Lyrics);
