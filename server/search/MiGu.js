
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
        }
    });

    if (response.success !== true || response.musics.length === 0) {
        error('Nothing.');
        return Promise.reject();
    }

    for (let e of response.musics) {
        if (
            artists.split(',').find(
                artist => e.singerName.indexOf(artist) !== -1
            )
        ) {
            debug('Got a result \n"%O"', e);

            return {
                src: e.mp3
            };
        }
    }

    return Promise.reject();
};
