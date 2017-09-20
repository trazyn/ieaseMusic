
import React, { Component } from 'react';
import { Link } from 'react-router';
import { inject, observer } from 'mobx-react';
import injectSheet from 'react-jss';
import clazz from 'classname';

import classes from './classes';
import helper from 'utils/helper';
import FadeImage from 'ui/FadeImage';
import Loader from 'ui/Loader';
import Header from 'components/Header';
import Controller from 'components/Controller';

@inject(stores => ({
    loading: stores.playlist.loading,
    types: stores.playlist.types,
    list: stores.playlist.list,
    getList: stores.playlist.getList,
}))
@observer
class Playlist extends Component {
    componentWillMount() {
        this.props.getList(encodeURIComponent(this.props.params.type));
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.params.type !== nextProps.params.type) {
            nextProps.getList(encodeURIComponent(nextProps.params.type));
        }
    }

    renderList() {
        var { classes, list } = this.props;

        return list.map((e, index) => {
            return (
                <article className={classes.item} key={index}>
                    <Link to={e.link}>
                        <FadeImage src={e.cover} />
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
        var { classes, loading, types, params, list } = this.props;

        return (
            <div className={classes.container} data-type={encodeURIComponent(params.type)}>
                <div className={classes.inner}>
                    <Loader show={loading} />
                    <Header {...{
                        showBack: true,
                    }} />

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

                    <section className={classes.list}>
                        {this.renderList()}
                    </section>

                    <Controller />
                </div>
            </div>
        );
    }
}

export default injectSheet(classes)(Playlist);
