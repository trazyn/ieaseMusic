
import request from 'request-promise-native';
import _debug from 'debug';

const debug = _debug('dev:plugin:QQ');
const error = _debug('dev:plugin:QQ:error');

async function getSong(mid) {
    var currentMs = (new Date()).getUTCMilliseconds();
    var guid = Math.round(2147483647 * Math.random()) * currentMs % 1e10;
    var file = await genKey(mid);
    var response = await request({
        uri: 'https://c.y.qq.com/base/fcgi-bin/fcg_musicexpress.fcg',
        qs: {
            json: 3,
            format: 'json',
            guid: guid.toString(),
        },
        json: true,
    });

    if (response.code !== 0) {
        return Promise.reject();
    }

    if (file.size_flac) {
        return {
            isFlac: true,
            src: getURL(`F000${mid}.flac`, response.key, guid),
        };
    }

    if (file.size_320mp3) {
        return {
            src: getURL(`M800${mid}.mp3`, response.key, guid),
        };
    }

    if (file.size_128mp3) {
        return {
            src: getURL(`M500${mid}.mp3`, response.key, guid),
        };
    }
}

async function genKey(mid) {
    var response = await request({
        uri: 'http://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg',
        qs: {
            songmid: mid,
            format: 'json',
        },
        json: true,
    });
    var data = response.data;

    if (response.code !== 0
        || data.length === 0) {
        debug('Nothing.');
        return Promise.reject();
    }

    return data[0]['file'];
}

function getURL(filename, key, guid) {
    return `http://dl.stream.qqmusic.qq.com/${filename}?vkey=${key}&guid=${guid}&fromtag=53`;
}

export default async(keyword, artists) => {
    debug(`Search '${keyword} - ${artists}' use QQ library.`);

    var response = await request({
        uri: 'http://c.y.qq.com/soso/fcgi-bin/search_cp',
        qs: {
            w: [keyword].concat(artists.split(',')).join('+'),
            p: 1,
            n: 100,
            aggr: 1,
            lossless: 1,
            cr: 1,
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'utf-8'
        },
        json: true,
    });

    var data = response.data;

    if (response.code !== 0
        || data.song.list.length === 0) {
        debug('Nothing.');
        return Promise.reject();
    }

    for (let e of data.song.list) {
        let song = {};

        // Match the artists
        if (e.singer.find(e => artists.indexOf(e.name) === -1)) {
            continue;
        }

        debug('Got a result \n"%O"', e);

        try {
            song = await getSong(e.media_mid);
        } catch (ex) {
            error('Failed to get song: %O', ex);
            return Promise.reject();
        }

        debug('%O', song);

        return song;
    }
};
