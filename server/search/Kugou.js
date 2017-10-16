
import axios from 'axios';
import md5 from 'md5';
import _debug from 'debug';

const debug = _debug('dev:plugin:Kugou');
const error = _debug('dev:plugin:Kugou:error');

async function getURL(hash) {
    var key = md5(`${hash}kgcloud`);

    var response = await axios.get(`http://trackercdn.kugou.com/i/?acceptMp3=1&cmd=4&pid=6&hash=${hash}&key=${key}`);
    var data = response.data;

    if (data.error
        || data.status !== 1) {
        error('Failed to get song URL: %O', data);
        return null;
    } else {
        return data.url;
    }
}

export default async(keyword, artists) => {
    debug(`Search '${keyword} - ${artists}' use Kugou library.`);

    var response = await axios.get(`http://mobilecdn.kugou.com/api/v3/search/song?format=json&keyword=${encodeURIComponent(keyword)}&page=1&pagesize=1&showtype=1`);
    var data = response.data;

    if (data.status !== 1
        || data.data.info.length === 0) {
        return;
    }

    for (let e of data.data.info) {
        if (artists.split(',').findIndex(artist => e.singername.indexOf(artist)) === -1) {
            continue;
        }

        debug('Find %O', e);

        return {
            src: await getURL(e['320hash'] || e['hash'])
        };
    }
};
