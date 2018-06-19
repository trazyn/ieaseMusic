
import request from 'request-promise-native';
import _debug from 'debug';

const debug = _debug('dev:plugin:MiGu');
const error = _debug('dev:plugin:MiGu:error');

async function getURL(id) {
    var response = await request({
        uri: 'http://m.music.migu.cn/music-h5/player/findSong.json',
        qs: {
            copyrightId: id
        },
        json: true,
    });

    if (+response.resultCode !== 200) {
        debug('Nothing.');
        return Promise.reject();
    } else {
        return response.data.mp3;
    }
}

export default async(keyword, artists) => {
    debug(`Search '${keyword} - ${artists}' use MiGu library.`);

    var response = await request({
        uri: 'http://m.music.migu.cn/music-h5/search/searchAll.json',
        qs: {
            keyWord: [keyword].concat(artists.split(',')).join('+'),
            type: 'song',
            pageNo: 1,
            pageSize: 20,
        },
        json: true,
    });

    var data = response.data || {};

    if (+response.resultCode !== 200
        || +data.count === 0) {
        error('Nothing.');
        return Promise.reject();
    }

    for (let e of data.list) {
        if (artists.split(',').find(artist => e.singerName.indexOf(artist)) === -1) {
            continue;
        }

        debug('Got a result \n"%O"', e);
        try {
            let song = {
                src: await getURL(e.fullSongCopyrightId)
            };

            debug('%O', song);
            return song;
        } catch (ex) {
            error('Failed to get song: %O', ex);
            return Promise.reject();
        }
    }
};
