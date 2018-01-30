
/* eslint-disable */
import express from 'express';
import cookieParser from 'cookie-parser';
import apicache from 'apicache'
import axios from 'axios';
/* eslint-enable */

const app = express();
const cache = apicache.middleware;
const onlyStatus200 = (req, res) => res.statusCode === 200;
const port = process.env.API_PORT || 8000;

app.use(cookieParser());

axios.defaults.baseURL = `http://localhost:${port}`;

// Set cookie for axios
app.use((req, res, next) => {
    axios.defaults.headers = req.headers;
    next();
});

// 获取专辑内容
app.use('/album', require('../NeteaseCloudMusicApi/router/album'));

// 获取歌手单曲
app.use('/artists', require('../NeteaseCloudMusicApi/router/artists'));

// 获取歌手专辑列表
app.use('/artist/album', require('../NeteaseCloudMusicApi/router/artist_album'));

// 艺术家-信息
app.use('/artist/desc', require('../NeteaseCloudMusicApi/router/artists_desc'));

// 艺术家-mv
app.use('/artist/mv', require('../NeteaseCloudMusicApi/router/artists_mv'));

// 获取 banner
app.use('/banner', require('../NeteaseCloudMusicApi/router/banner'));

app.use('/check/music', require('../NeteaseCloudMusicApi/router/check_music'));

app.use('/comment/music', require('../NeteaseCloudMusicApi/router/comment_music'));

app.use('/comment/mv', require('../NeteaseCloudMusicApi/router/comment_mv'));

app.use('/comment/album', require('../NeteaseCloudMusicApi/router/comment_album'));

app.use('/comment/playlist', require('../NeteaseCloudMusicApi/router/comment_playlist'));

app.use('/comment/dj', require('../NeteaseCloudMusicApi/router/comment_dj'));

// 签到
app.use('/daily_signin', require('../NeteaseCloudMusicApi/router/daily_signin'));

// djradio detail
app.use('/dj/detail', require('../NeteaseCloudMusicApi/router/dj_detail'));

// dj主播 radio
app.use('/dj/program', require('../NeteaseCloudMusicApi/router/dj_program'));

app.use('/dj/program/detail', require('../NeteaseCloudMusicApi/router/dj_program_detail'));

app.use('/dj/sub', require('../NeteaseCloudMusicApi/router/dj_sub'));

app.use('/dj/catelist', require('../NeteaseCloudMusicApi/router/dj_catelist'));

app.use('/dj/hot', require('../NeteaseCloudMusicApi/router/dj_hot'));

// 精选电台
app.use('/dj/recommend', require('../NeteaseCloudMusicApi/router/dj_recommend'));

// 精选电台-分类电台
app.use('/dj/recommend/type', require('../NeteaseCloudMusicApi/router/dj_recommend_type'));

// 获取动态
app.use('/event', require('../NeteaseCloudMusicApi/router/event'));

// 垃圾桶
app.use('/fm_trash', require('../NeteaseCloudMusicApi/router/fm_trash'));

// 喜欢歌曲
app.use('/like', require('../NeteaseCloudMusicApi/router/like'));

app.use('/likelist', require('../NeteaseCloudMusicApi/router/likelist'));

// 不明 api
app.use('/log/web', require('../NeteaseCloudMusicApi/router/logWeb'));

// 获取歌词
app.use('/lyric', require('../NeteaseCloudMusicApi/router/lyric'));

// 获取音乐 url
app.use('/music/url', require('../NeteaseCloudMusicApi/router/musicUrl'));

// 最新 mv
app.use('/mv/first', require('../NeteaseCloudMusicApi/router/mv_first'));

// 播放 mv
app.use('/mv/url', require('../NeteaseCloudMusicApi/router/mv_url'));

// mv
app.use('/mv', require('../NeteaseCloudMusicApi/router/mv'));

// 私人 FM
app.use('/personal_fm', require('../NeteaseCloudMusicApi/router/personal_fm'));

// 推荐歌单
app.use('/personalized', cache('120 minutes', onlyStatus200), require('../NeteaseCloudMusicApi/router/personalized'));

// 推荐dj
app.use('/personalized/djprogram', require('../NeteaseCloudMusicApi/router/personalized_djprogram'));

// 推荐新音乐
app.use('/personalized/newsong', require('../NeteaseCloudMusicApi/router/personalized_newsong'));

// 独家放送
app.use(
    '/personalized/privatecontent',
    require('../NeteaseCloudMusicApi/router/personalized_privatecontent')
);

// 推荐mv
app.use('/personalized/mv', require('../NeteaseCloudMusicApi/router/personalized_mv'));

// 获取歌单内列表
app.use('/playlist/detail', require('../NeteaseCloudMusicApi/router/playlist_detail'));

// 收藏单曲到歌单,从歌单删除歌曲 op=del,add;pid=歌单id,tracks=歌曲id
app.use('/playlist/tracks', require('../NeteaseCloudMusicApi/router/playlist_tracks'));

app.use('/playlist/hot', require('../NeteaseCloudMusicApi/router/playlist_hot'));

app.use('/playlist/catlist', require('../NeteaseCloudMusicApi/router/playlist_catlist'));

// 推荐节目
app.use('/program/recommend', require('../NeteaseCloudMusicApi/router/program_recommend'));

// 获取每日推荐歌曲
app.use('/recommend/songs', cache('120 minutes', onlyStatus200), require('../NeteaseCloudMusicApi/router/recommend_songs'));

// 获取每日推荐歌单
app.use('/recommend/resource', cache('120 minutes', onlyStatus200), require('../NeteaseCloudMusicApi/router/recommend_resource'));

// 取消推荐
app.use('/recommend/dislike', require('../NeteaseCloudMusicApi/router/recommend_dislike'));

app.use('/resource/like', require('../NeteaseCloudMusicApi/router/resource_like'));

// 搜索
app.use('/search', require('../NeteaseCloudMusicApi/router/search'));

// 搜索 multimatch
app.use('/search/multimatch', require('../NeteaseCloudMusicApi/router/search_multimatch'));

// 搜索 suggest,搜索结果包含单曲,歌手,歌单,mv信息
app.use('/search/suggest', require('../NeteaseCloudMusicApi/router/search_suggest'));

// simi ,相似歌单
app.use('/simi/playlist', require('../NeteaseCloudMusicApi/router/simi_playlist'));

// simi ,相似歌曲
app.use('/simi/song', require('../NeteaseCloudMusicApi/router/simi_song'));

// 相似 mv
app.use('/simi/mv', require('../NeteaseCloudMusicApi/router/simi_mv'));

// simi ,相似关注的用户
app.use('/simi/user', require('../NeteaseCloudMusicApi/router/simi_user'));

// 相似歌手
app.use('/simi/artist', require('../NeteaseCloudMusicApi/router/simi_artists'));

// 获取音乐详情
app.use('/song/detail', require('../NeteaseCloudMusicApi/router/song_detail'));

// 新碟上架 http://music.163.com/#/discover/album/
app.use('/top/album', require('../NeteaseCloudMusicApi/router/top_album'));

// 热门歌手 http://music.163.com/#/discover/artist/
app.use('/top/artists', require('../NeteaseCloudMusicApi/router/top_artists'));

app.use('/top/list', require('../NeteaseCloudMusicApi/router/top_list'));

app.use('/top/mv', require('../NeteaseCloudMusicApi/router/top_mv'));

// 分类歌单
app.use('/top/playlist', require('../NeteaseCloudMusicApi/router/top_playlist'));

// 精品歌单
app.use(
    '/top/playlist/highquality',
    require('../NeteaseCloudMusicApi/router/top_playlist_highquality')
);

app.use('/top/song', require('../NeteaseCloudMusicApi/router/top_songs'));

app.use('/toplist', require('../NeteaseCloudMusicApi/router/toplist'));

app.use('/toplist/artist', require('../NeteaseCloudMusicApi/router/toplist_artist'));

app.use('/toplist/detail', require('../NeteaseCloudMusicApi/router/toplist_detail'));

// 获取用户歌单
app.use('/user/playlist', require('../NeteaseCloudMusicApi/router/user_playlist'));

// 获取用户电台
app.use('/user/audio', require('../NeteaseCloudMusicApi/router/user_audio'));

// 云盘数据
app.use('/user/cloud', require('../NeteaseCloudMusicApi/router/user_cloud'));

// 云盘数据详情? 暂时不要使用
app.use('/user/cloud/search', require('../NeteaseCloudMusicApi/router/user_cloud_search'));

// 用户动态
app.use('/user/event', require('../NeteaseCloudMusicApi/router/user_event'));

app.use('/user/detail', require('../NeteaseCloudMusicApi/router/user_detail'));

app.use('/user/dj', require('../NeteaseCloudMusicApi/router/user_dj'));

app.use('/user/followeds', require('../NeteaseCloudMusicApi/router/user_followeds'));

app.use('/user/follows', require('../NeteaseCloudMusicApi/router/user_follows'));

app.use('/user/subcount', require('../NeteaseCloudMusicApi/router/user_subcount'));

app.use('/user/record', require('../NeteaseCloudMusicApi/router/user_playrecord'));

// New added
app.use('/thumbsup', require('./api/thumbsup'));
app.use('/hot/album', require('./api/hot_album'));
app.use('/subscribe', require('./api/subscribe'));
app.use('/unsubscribe', require('./api/unsubscribe'));
app.use('/follow', require('./api/follow'));
app.use('/unfollow', require('./api/unfollow'));
app.use('/sub', require('./api/sub'));
app.use('/unsub', require('./api/unsub'));
app.use('/login/cellphone', require('./api/loginCellphone'));
app.use('/login/refresh', cache('1 hour', onlyStatus200), require('./api/login_refresh'));
app.use('/login', require('./api/login'));
app.use('/scrobble', require('./api/scrobble'));

app.use('/api/home', require('./router/home'));
app.use('/api/player', require('./router/player'));
app.use('/api/user', require('./router/user'));
app.use('/api/artist', require('./router/artist'));
app.use('/api/top', cache('1 hour', onlyStatus200), require('./router/top'));
app.use('/api/playlist', cache('10 minutes', onlyStatus200), require('./router/playlist'));
app.use('/api/fm', require('./router/fm'));
app.use('/api/search', require('./router/search'));
app.use('/api/comments', require('./router/comments'));
app.use('/api/lyrics', cache('360 minutes'), require('./router/lyrics'));

if (process.env.AUTORUN) {
    console.log(`API Server run with port: ${port}`);
    app.listen(port);
}

export default app;
