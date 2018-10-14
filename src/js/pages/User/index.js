import React, {Component} from 'react';
// import Scroller from 'react-scroll-horizontal';
// import 'react-virtualized/styles.css';
// import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
// import List from 'react-virtualized/dist/commonjs/List';

import {Link} from 'react-router-dom';
import {inject, observer} from 'mobx-react';
import injectSheet from 'react-jss';
import clazz from 'classname';

import classes from './classes';
import helper from 'utils/helper';
import ProgressImage from 'ui/ProgressImage';
import Loader from 'ui/Loader';
import Header from 'components/Header';
// import FadeImage from 'ui/FadeImage';
import Controller from 'components/Controller';

@inject(stores => ({
    loading: stores.user.loading,
    getUser: stores.user.getUser,
    song: stores.controller.song,
    profile: stores.user.profile,
    playlists: stores.user.playlists,
    follow: stores.user.follow,
    controller: stores.controller,
    isme: () => stores.user.profile.id === stores.me.profile.userId.toString(),
    isPlaying: id => {
        var controller = stores.controller;

        return controller.playing && controller.playlist.id === id;
    },
    naturalScroll: stores.preferences.naturalScroll,
}))
@observer
class User extends Component {
  componentWillMount = () => this.props.getUser(this.props.match.params.id);

  componentWillReceiveProps(nextProps) {
      if (nextProps.match.params.id !== this.props.match.params.id) {
          nextProps.getUser(nextProps.match.params.id);
      }
  }

  renderList() {
      var {classes, playlists} = this.props;

      return (
      //   <Scroller reverseScroll={!naturalScroll}>
      //   <div>
      //       {() =>
          playlists.map((e, index) => {
              return (
                  <Link
                      className={clazz('clearfix', classes.item, {
                          [classes.playing]: this.props.isPlaying(e.id),
                      })}
                      to={e.link}
                      key={index}
                  >
                      <ProgressImage
                          {...{
                              height: 120,
                              width: 120,
                              src: e.cover,
                          }}
                      />

                      <div className={classes.meta}>
                          <p className={classes.name}>
                              <span> {e.name} </span>
                          </p> <p className={classes.played}>
                              <span>
                                  {helper.humanNumber(e.played)}
                                                    Played
                              </span>
                          </p>
                      </div>
                  </Link>
              );
          })
      //         }
      //   </div>

      //   </Scroller>
      );
  }

  render() {
      var {classes, loading, song, profile, isme, follow, controller} = this.props;
      var followed = profile.followed;

      // Force rerender all, let image progressively load
      if (loading) {
          return <Loader show={true} />;
      }

      return (
          <div className={classes.container}>

              <Header
                  {...{
                      transparent: true,
                      showBack: true,
                      showPlaylist: true,
                  }}
              />
              <button
                  style={{
                      display: isme() ? 'none' : 'block',
                  }}
                  className={clazz(classes.follow, {
                      [classes.followed]: followed,
                  })}
                  onClick={e => follow(followed)}
              >
                  {followed ? 'Followed' : 'Follow'}
              </button>
              {song.id
                  ? <figure
                      style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          height: '100%',
                          width: '100%',
                          padding: 0,
                          margin: 0,
                          overflow: 'hidden',
                      }}
                  >
                      <figcaption
                          style={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              width: window.innerWidth,
                              height: window.innerWidth,
                              padding: 0,
                              margin: 0,
                              backgroundImage: `url(${song.album.cover.replace(/\?param=.*/, '') + '?param=800y800'})`,
                              backgroundSize: `${window.innerWidth}px ${window.innerWidth}px`,
                              filter: 'blur(10px)',
                              zIndex: -1,
                          }}
                      />
                  </figure>
                  : false}
              <main>
                  <aside className={classes.navs}>
                      <nav className={classes.menu}>
                          <div className={classes.hero}>
                              <ProgressImage
                                  {...{
                                      height: 160,
                                      width: 160,
                                      src: profile.avatar,
                                  }}
                              />
                              {/* <FadeImage src={profile.avatarUrl} /> */}
                              <div className={classes.info}>
                                  <p className={classes.username}>
                                      <span> {profile.name} </span>
                                  </p>

                                  <p className={classes.followers}>
                                      <span>
                                          {helper.formatNumber(profile.followers)}
                                Followers
                                      </span>
                                  </p>

                                  <p className={classes.signature}>
                                      <span> {profile.signature || 'No signature~'} </span>
                                  </p>
                              </div>
                          </div>
                      </nav>
                  </aside>
                  <section className={classes.list}>

                      {this.renderList()}
                  </section>
                  {/* <div className={classes.list}> {this.renderList()} </div> */}
              </main>
              <Controller key={controller.song.id} />

          </div>
      );
  }
}

export default injectSheet(classes)(User);
