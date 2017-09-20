
import React, { Component } from 'react';
import Scroller from 'react-scroll-horizontal';
import { Link } from 'react-router';
import { inject, observer } from 'mobx-react';
import injectSheet from 'react-jss';
import clazz from 'classname';
import moment from 'moment';

import classes from './classes';
import FadeImage from 'ui/FadeImage';
import Loader from 'ui/Loader';
import Header from 'components/Header';
import Controller from 'components/Controller';

@inject(stores => ({
    loading: stores.top.loading,
    list: stores.top.list,
    getList: stores.top.getList,
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

        return (
            <Link className={clazz('clearfix', classes.item)} to={item.link}>
                <FadeImage src={item.cover} />

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
        var { classes, loading } = this.props;

        return (
            <div className={classes.container}>
                <Loader show={loading} />

                <Header {...{
                    showBack: true,
                    showFav: true,
                }} />

                <Scroller>
                    {
                        this.renderList()
                    }
                </Scroller>

                <Controller />
            </div>
        );
    }
}

export default injectSheet(classes)(Top);
