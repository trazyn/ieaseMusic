
import axios from 'axios';
import _debug from 'debug';

const debug = _debug('dev:plugin:Baidu');
const error = _debug('dev:plugin:Baidu:error');

export default async(keyword, artists) => {
    debug(`Search '${keyword} - ${artists}' use Baidu library.`);

    var response = await axios.get('http://sug.music.baidu.com/info/suggestion', {
        params: {
            word: keyword,
            version: 2,
            from: 0,
        }
    });
    var songs = response.data.data.song;
    var song = songs.find(e => artists.indexOf(e.artistname) > -1);

    if (!song) {
        return false;
    }
    response = await axios.get('http://music.baidu.com/data/music/fmlink', {
        params: {
            songIds: song.songid,
            type: 'mp3',
            rate: '320',
        },
    });

    try {
        song = {
            src: response.data.data.songList[0].songLink,
        };
    } catch (ex) {
        // Anti-warnning
        error('Failed to get song URL: %O', ex);
        song = false;
    }

    return song;
};
