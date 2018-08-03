
import React, { Component } from 'react';
import Scroller from 'react-scroll-horizontal';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import injectSheet from 'react-jss';
import clazz from 'classname';
import moment from 'moment';

import classes from './classes';
import ProgressImage from 'ui/ProgressImage';
import Loader from 'ui/Loader';
import Header from 'components/Header';
import Controller from 'components/Controller';

@inject(stores => ({
    loading: stores.top.loading,
    list: stores.top.list,
    getList: stores.top.getList,
    naturalScroll: stores.preferences.naturalScroll,
}))
@observer
class Top extends Component {
    componentWillMount() {
        this.props.getList();
    }

    renderItem(item) {
        if (!item) {
            return false;
        }

        var classes = this.props.classes;
        var height = (window.innerHeight - 50) / 2;

        return (
            <Link
                className={clazz('clearfix', classes.item)}
                to={item.link}>
                <ProgressImage {...{
                    height,
                    width: height,
                    src: item.cover,
                }} />

                <article className={classes.info}>
                    <p>
                        {item.name}
                    </p>

                    <div className={classes.line} />

                    <span>
                        {
                            moment(item.updateTime).startOf('hour').fromNow()
                        }
                    </span>
                </article>
            </Link>
        );
    }

    renderList() {
        var list = this.props.list;
        var columns = [];

        for (var i = 0, length = Math.ceil(list.length / 2); i < length; ++i) {
            var item = list[i * 2];
            var next = list[i * 2 + 1];

            columns.push(
                <div key={i} className="clearfix">
                    {
                        this.renderItem(item)
                    }
                    {
                        this.renderItem(next)
                    }
                </div>
            );
        }

        return columns;
    }

    render() {
        var { classes, loading, naturalScroll } = this.props;

        if (loading) {
            return <Loader show={true} />;
        }

        return (
            <div className={classes.container}>
                <Header {...{
                    showBack: true,
                    transparent: true,
                }} />

                <Scroller reverseScroll={!naturalScroll}>
                    {
                        () => this.renderList()
                    }
                </Scroller>

                <Controller />
            </div>
        );
    }
}

export default injectSheet(classes)(Top);
