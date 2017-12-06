
import request from 'request-promise-native';
import _debug from 'debug';
import md5 from 'md5';

const debug = _debug('dev:plugin:Kugou');
const error = _debug('dev:plugin:Kugou:error');

async function getURL(hash) {
    var key = md5(`${hash}kgcloud`);

    var response = await request({
        url: `http://trackercdn.kugou.com/i/?acceptMp3=1&cmd=4&pid=6&hash=${hash}&key=${key}`,
        json: true,
    });

    if (response.error
        || response.status !== 1) {
        debug('Nothing.');
        return Promise.reject();
    } else {
        return response.url;
    }
}

export default async(keyword, artists) => {
    debug(`Search '${keyword} - ${artists}' use Kugou library.`);

    var response = await request({
        uri: 'http://mobilecdn.kugou.com/api/v3/search/song',
        qs: {
            format: 'json',
            keyword: [keyword].concat(artists.split(',')).join('+'),
            page: 1,
            pagesize: 1,
            showtype: 1,
        },
        json: true,
    });

    var data = response.data;

    if (response.status !== 1
        || data.info.length === 0) {
        error('Nothing.');
        return Promise.reject();
    }

    for (let e of data.info) {
        if (artists.split(',').find(artist => e.singername.indexOf(artist)) === -1) {
            continue;
        }

        debug('Got a result \n"%O"', e);
        try {
            let song = {
                src: await getURL(e['320hash'] || e['hash'])
            };

            debug('%O', song);
            return song;
        } catch (ex) {
            error('Failed to get song: %O', ex);
            return Promise.reject();
        }
    }
};
