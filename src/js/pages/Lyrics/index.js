
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import injectSheet from 'react-jss';

import classes from './classes';
import ProgressImage from 'ui/ProgressImage';
import Loader from 'ui/Loader';
import Hero from 'components/Hero';
import Header from 'components/Header';

@inject(stores => ({
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

    renderLyrics() {
        var { lyrics, classes } = this.props;
        var times = Object.keys(lyrics);

        if (times.length === 0) {
            return (
                <div className={classes.placeholder}>
                    <span>
                        Nothing ...
                    </span>
                </div>
            );
        }

        return times.map(
            (e, index) => {
                return (
                    <p
                        data-times={e}
                        key={index}
                    >
                        <span>
                            {
                                lyrics[e]
                            }
                        </span>
                    </p>
                );
            }
        );
    }

    render() {
        var { classes, loading, song } = this.props;

        if (loading || !song.id) {
            return <Loader show={true} />;
        }

        return (
            <div className={classes.container}>
                <Header
                    transparent={true}
                    showBack={true}
                />

                <Hero location={this.props.location} />

                <aside
                    id="lyrics"
                    className={classes.lyrics}
                >
                    <ProgressImage
                        {...{
                            height: window.innerHieght,
                            width: window.innerHieght,
                            src: song.album.cover.replace(/\?.*$/, ''),
                        }}
                    />

                    <section
                        onWheel={
                            e => {
                                e.currentTarget.setAttribute('scrolling', true);
                            }
                        }
                        onMouseLeave={
                            e => {
                                e.currentTarget.removeAttribute('scrolling');
                            }
                        }
                    >
                        <div
                            style={{
                                position: 'relative',
                                paddingTop: '10vh',
                                paddingBottom: '14vh',
                            }}
                        >
                            {
                                this.renderLyrics()
                            }
                        </div>
                    </section>
                </aside>
            </div>
        );
    }
}

export default injectSheet(classes)(Lyrics);
