
import _debug from 'debug';
import chalk from 'chalk';

const debug = _debug('dev:plugin:Baidu');

export default async(request, keyword, artists) => {
    debug(chalk.black.bgGreen('💊  Loaded Baidu music.'));

    try {
        var response = await request({
            uri: 'http://sug.music.baidu.com/info/suggestion',
            qs: {
                word: [keyword].concat(artists.split(',')).join('+'),
                version: 2,
                from: 0,
                _: +new Date(),
            },
        });
        var songs = (response.data || {}).song;
        var song = (songs || []).find(e => artists.indexOf(e.artistname) > -1);

        if (!song) {
            return Promise.reject(Error(404));
        }

        console.log('done');

        response = await request({
            uri: 'http://music.taihe.com/data/music/fmlink',
            qs: {
                songIds: song.songid,
            },
        });

        if (
            false
            || +response.errorCode !== 22000
            || response.data.songList.length === 0
        ) {
            return Promise.reject(Error(404));
        }

        song = response.data.songList[0];

        song.src = song.songLink;
        song.bitRate = song.rate * 1000;

        if (!song.src) {
            return Promise.reject(Error(404));
        }
    } catch (ex) {
        // Anti-warnning
        return Promise.reject(ex);
    }

    return song;
};
