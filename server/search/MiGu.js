
import _debug from 'debug';

const debug = _debug('dev:plugin:MiGu');
const error = _debug('dev:plugin:MiGu:error');

export default async(request, keyword, artists) => {
    debug(`Search '${keyword} - ${artists}' use MiGu library.`);

    var response = await request({
        uri: 'http://m.10086.cn/migu/remoting/scr_search_tag',
        qs: {
            keyword: [keyword].concat(artists.split(',')).join('+'),
            type: 2,
            rows: 20,
            pgc: 1,
        },
        json: true,
    });

    if (response.success !== true || response.musics.length === 0) {
        error('Nothing.');
        return Promise.reject();
    }

    for (let e of response.musics) {
        if (artists.split(',').find(artist => e.singerName.indexOf(artist)) === -1) {
            continue;
        }

        debug('Got a result \n"%O"', e);
        try {
            let song = {
                src: e.mp3
            };

            debug('%O', song);
            return song;
        } catch (ex) {
            error('Failed to get song: %O', ex);
            return Promise.reject();
        }
    }
};
