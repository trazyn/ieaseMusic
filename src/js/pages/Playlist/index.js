
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import injectSheet from 'react-jss';
import clazz from 'classname';

import classes from './classes';
import helper from 'utils/helper';
import ProgressImage from 'ui/ProgressImage';
import Loader from 'ui/Loader';
import Header from 'components/Header';
import Controller from 'components/Controller';

@inject(stores => ({
    loading: stores.playlist.loading,
    types: stores.playlist.types,
    list: stores.playlist.list,
    getList: stores.playlist.getList,
    loadmore: stores.playlist.loadmore,
    isPlaying: (id) => {
        return stores.controller.playlist.id === id;
    }
}))
@observer
class Playlist extends Component {
    componentWillMount() {
        this.props.getList(encodeURIComponent(this.props.match.params.type));
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.match.params.type !== nextProps.match.params.type) {
            nextProps.getList(encodeURIComponent(nextProps.match.params.type));
        }
    }

    async loadmore(e) {
        var container = this.list;

        // Drop the duplicate invoke
        if (container.classList.contains(classes.loadmore)) {
            return;
        }

        if (container.scrollTop + container.offsetHeight + 50 > container.scrollHeight) {
            // Mark as loading
            container.classList.add(classes.loadmore);

            await this.props.loadmore();
            container.classList.remove(classes.loadmore);
        }
    }

    renderList() {
        var { classes, list, isPlaying } = this.props;

        return list.map((e, index) => {
            return (
                <article
                    className={clazz(classes.item, {
                        [classes.playing]: isPlaying(e.id),
                    })}
                    key={index}>
                    <Link to={e.link}>
                        <ProgressImage {...{
                            height: 64,
                            width: 64,
                            src: e.cover,
                        }} />
                    </Link>

                    <aside className={classes.info}>
                        <p title={e.name}>{e.name}</p>
                        <p>
                            <Link to={e.user.link}>{e.user.name}</Link>
                        </p>
                        <span>
                            {helper.humanNumber(e.played)} Played
                        </span>
                    </aside>
                </article>
            );
        });
    }

    render() {
        var { classes, loading, types, match: { params }, list } = this.props;

        return (
            <div
                className={classes.container}
                data-type={encodeURIComponent(params.type)}
            >
                <Header
                    {...{
                        transparent: true,
                        showBack: true,
                    }}
                />

                <div className={classes.inner}>
                    <Loader show={loading} />

                    <ul className={classes.navs}>
                        {
                            types.map((e, index) => {
                                var selected = params.type === e.name;

                                return (
                                    <li
                                        key={index}
                                        className={clazz(classes.nav, {
                                            [classes.selected]: selected,
                                        })}>
                                        {
                                            selected
                                                ? (<Link to={`/playlist/${encodeURIComponent(e.name)}`}>{e.name} / {list.length} LIST</Link>)
                                                : (<Link to={`/playlist/${encodeURIComponent(e.name)}`}>{e.name}</Link>)
                                        }
                                    </li>
                                );
                            })
                        }
                    </ul>

                    <section
                        className={classes.list}
                        ref={
                            ele => (this.list = ele)
                        }
                        onScroll={e => this.loadmore()}
                    >
                        {this.renderList()}
                    </section>

                    <Controller />
                </div>
            </div>
        );
    }
}

export default injectSheet(classes)(Playlist);
