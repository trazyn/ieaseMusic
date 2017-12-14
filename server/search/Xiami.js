
import request from 'request-promise-native';
import _debug from 'debug';

const debug = _debug('dev:plugin:Xiami');
const error = _debug('dev:plugin:Xiami:error');
const headers = {
    cookie: 'user_from=2;XMPLAYER_addSongsToggler=0;XMPLAYER_isOpen=0;_xiamitoken=cb8bfadfe130abdbf5e2282c30f0b39a;',
    referer: 'http://h.xiami.com/',
    user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.75 Safari/537.36',
};

export default async(keyword, artists) => {
    debug(`Search '${keyword} - ${artists}' use Xiami library.`);

    var response = await request({
        uri: 'http://api.xiami.com/web',
        qs: {
            v: '2.0',
            key: [keyword].concat(artists.split(',')).join('+'),
            limit: 100,
            page: 1,
            r: 'search/songs',
            app_key: 1,
        },
        json: true,
        headers,
    });

    var data = response.data;

    if (response.state !== 0
        || data.songs.length === 0) {
        error('Nothing.');
        return Promise.reject();
    }

    for (let e of data.songs) {
        if (artists.split(',').find(artist => e.artist_name.indexOf(artist)) === -1) {
            continue;
        }

        let song = {
            src: e.listen_file,
        };

        if (!song.src) {
            return Promise.reject();
        } else {
            debug('Got a result \n"%O"', song);
            return song;
        }
    }
};
