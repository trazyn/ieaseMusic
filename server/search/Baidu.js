
import request from 'request-promise-native';
import _debug from 'debug';

const debug = _debug('dev:plugin:Baidu');
const error = _debug('dev:plugin:Baidu:error');

export default async(keyword, artists) => {
    debug(`Search '${keyword} - ${artists}' use Baidu library.`);

    var response = await request({
        uri: 'http://sug.music.baidu.com/info/suggestion',
        qs: {
            word: [keyword].concat(artists.split(',')).join('+'),
            version: 2,
            from: 0,
        },
        json: true,
    });
    var songs = (response.data || {}).song;
    var song = (songs || []).find(e => artists.indexOf(e.artistname) > -1);

    if (!song) {
        debug('Nothing.');
        return Promise.reject();
    }
    response = await request({
        uri: 'http://music.baidu.com/data/music/fmlink',
        qs: {
            songIds: song.songid,
            type: 'mp3',
            rate: '320',
        },
        json: true,
    });

    try {
        song = {
            src: response.data.songList[0].songLink,
        };

        if (!song.src) {
            return Promise.reject();
        } else {
            debug('Got a result \n"%O"', song);
        }
    } catch (ex) {
        // Anti-warnning
        error('Failed to get song: %O', ex);
        return Promise.reject();
    }

    return song;
};
