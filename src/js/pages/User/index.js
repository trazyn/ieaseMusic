
import React, { Component } from 'react';
import Scroller from 'react-scroll-horizontal';
import { Link } from 'react-router';
import { inject, observer } from 'mobx-react';
import injectSheet from 'react-jss';
import clazz from 'classname';

import classes from './classes';
import helper from 'utils/helper';
import FadeImage from 'ui/FadeImage';
import Loader from 'ui/Loader';
import Header from 'components/Header';

@inject(stores => ({
    loading: stores.user.loading,
    getUser: stores.user.getUser,
    profile: stores.user.profile,
    playlists: stores.user.playlists,
    isme: () => stores.user.profile.id === stores.me.profile.userId,
}))
@observer
class User extends Component {
    componentWillMount = () => this.props.getUser(this.props.params.id);

    renderList() {
        var { classes, playlists } = this.props;

        return (
            <Scroller>
                {
                    playlists.map((e, index) => {
                        return (
                            <Link
                                className={clazz('clearfix', classes.item)}
                                to={e.link}
                                key={index}>
                                <FadeImage src={e.cover} />
                                <div className={classes.meta}>
                                    <p className={classes.name}>
                                        <span>{e.name}</span>
                                    </p>
                                    <p className={classes.played}>
                                        <span>{helper.humanNumber(e.played)} Played</span>
                                    </p>
                                </div>
                            </Link>
                        );
                    })
                }
            </Scroller>
        );
    }

    render() {
        var { classes, loading, profile, isme } = this.props;

        return (
            <div className={classes.container}>
                <Loader className={loading} />

                <Header {...{
                    showBack: true,
                    showFollow: !isme(),
                    showPlaylist: true,
                }} />

                <div className={classes.hero}>
                    <FadeImage className={classes.avatar} src={profile.avatar} />

                    <div className={classes.info}>
                        <p className={classes.username}>
                            <span>
                                {profile.name}
                            </span>
                        </p>

                        <p className={classes.followers}>
                            <span>
                                {helper.formatNumber(profile.followers)} Followers
                            </span>
                        </p>

                        <p className={classes.signature}>
                            <span>
                                {profile.signature || 'No signature~'}
                            </span>
                        </p>
                    </div>
                </div>

                <div className={classes.list}>
                    {
                        this.renderList()
                    }
                </div>
            </div>
        );
    }
}

export default injectSheet(classes)(User);
