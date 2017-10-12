
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router';
import injectSheet from 'react-jss';

import classes from './classes';
import helper from 'utils/helper';
import ProgressImage from 'ui/ProgressImage';

@inject(stores => ({
    loading: stores.search.loading,
    show: stores.search.show,
    close: () => stores.search.toggle(false),
    playlists: stores.search.playlists,
    getPlaylists: stores.search.getPlaylists,
    loadmorePlaylists: stores.search.loadmorePlaylists,
}))
@observer
class Search extends Component {
    state = {
        renderContent: this.renderPlaylist.bind(this),
        search: this.props.getPlaylists,
        loadmore: this.props.loadmorePlaylists,
    };

    search(e) {
        if (e.keyCode !== 13) {
            return;
        }
        var keyword = e.target.value.trim();

        this.state.search(keyword);
    }

    renderPlaylist() {
        var { classes, close, playlists } = this.props;

        if (playlists.length === 0) {
            return (
                <div className={classes.placeholder}>
                    <span>Nothing ...</span>
                </div>
            );
        }

        return playlists.map((e, index) => {
            return (
                <Link
                    className={classes.row}
                    key={index}
                    onClick={close}
                    to={e.link}>
                    <ProgressImage {...{
                        src: e.cover,
                        height: 40,
                        width: 40,
                    }} />

                    <aside>
                        <span>
                            {e.name}
                        </span>

                        <div>
                            <span className={classes.star}>
                                {helper.humanNumber(e.star)}

                                <i className="ion-ios-star" />
                            </span>

                            <span className={classes.played}>
                                {helper.humanNumber(e.played)} Played
                            </span>
                        </div>

                        <span className={classes.tracks}>
                            {e.size} Tracks
                        </span>
                    </aside>
                </Link>
            );
        });
    }

    loadmore(e) {
        var container = this.refs.list;

        if (this.props.loading) {
            return;
        }

        if (container.scrollTop + container.offsetHeight + 50 > container.scrollHeight) {
            this.state.loadmore();
        }
    }

    render() {
        var { classes, loading, show } = this.props;

        if (!show) {
            return false;
        }

        return (
            <div className={classes.container}>
                <div className={classes.inner}>
                    <header>
                        <input
                            onKeyUp={e => this.search(e)}
                            placeholder="Search ..."
                            ref="search"
                            type="text" />
                    </header>

                    <nav>
                        <span className={classes.selected}>Playlist</span>
                        <span>Album</span>
                        <span>Singer</span>
                        <span>User</span>
                    </nav>

                    <section
                        className={classes.list}
                        onScroll={e => this.loadmore(e)}
                        ref="list">
                        {
                            loading
                                ? (
                                    <div className={classes.placeholder}>
                                        <span>Loading ...</span>
                                    </div>
                                )
                                : this.state.renderContent()
                        }
                    </section>
                </div>
            </div>
        );
    }
}

export default injectSheet(classes)(Search);
