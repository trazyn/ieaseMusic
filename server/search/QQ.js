
import axios from 'axios';
import _debug from 'debug';

const debug = _debug('dev:plugin:QQ');
const error = _debug('dev:plugin:QQ:error');

async function getSong(mid) {
    var currentMs = (new Date()).getUTCMilliseconds();
    var guid = Math.round(2147483647 * Math.random()) * currentMs % 1e10;
    var file = await genKey(mid);
    var response = await axios.get(`https://c.y.qq.com/base/fcgi-bin/fcg_musicexpress.fcg?json=3&format=json&guid=${guid.toString()}`);
    var data = response.data;

    if (data.code !== 0) {
        return false;
    }

    if (file.size_320mp3) {
        return getURL('M800', mid, data.key, guid);
    }

    if (file.size_128mp3) {
        return getURL('M500', mid, data.key, guid);
    }
}

async function genKey(mid) {
    var response = await axios.get('http://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg', {
        params: {
            songmid: mid,
            format: 'json',
        },
    });
    var data = response.data;

    if (data.code !== 0
        || data.data.length === 0) {
        return;
    }

    return data.data[0]['file'];
}

function getURL(perfix, mid, key, guid) {
    return `http://dl.stream.qqmusic.qq.com/${perfix}${mid}.mp3?vkey=${key}&guid=${guid}&fromtag=30`;
}

export default async(keyword, artists) => {
    debug(`Search '${keyword} - ${artists}' use QQ library.`);

    var response = await axios.get('http://c.y.qq.com/soso/fcgi-bin/search_cp', {
        params: {
            w: keyword,
            p: 1,
            n: 100,
            aggr: 1,
            lossless: 1,
            cr: 1,
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'utf-8'
        }
    });
    var data = response.data;

    if (data.code !== 0
        || data.data.song.list.length === 0) {
        error('Nothing.');
        return;
    }

    for (let e of data.data.song.list) {
        let song = {};

        // Match the artists
        if (e.singer.find(e => artists.indexOf(e.name) === -1)) {
            continue;
        }

        debug('Got a result \n"%O"', e);

        try {
            song.src = await getSong(e.media_mid);
        } catch (ex) {
            error('Failed to get song: %O', ex);
        }

        return song;
    }
};
