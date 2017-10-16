
import axios from 'axios';
import _debug from 'debug';

const debug = _debug('dev:plugin:QQ');
const error = _debug('dev:plugin:QQ:error');
const baseUrl = 'dl.stream.qqmusic.qq.com';
const baseApi = 'http://101.96.10.58/c.y.qq.com';

let updateTime = null;
let vkey = null;
let guid = null;

async function updateVkey() {
    var currentMs = (new Date()).getUTCMilliseconds();
    guid = Math.round(2147483647 * Math.random()) * currentMs % 1e10;

    if (!updateTime
        || updateTime + 3600 * 1000 < +new Date()) {
        try {
            var response = await axios.get(`${baseApi}/base/fcgi-bin/fcg_musicexpress.fcg?json=3&guid=${guid}&g_tk=5381&jsonpCallback=jsonCallback&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf8&notice=0&platform=yqq&needNewCode=0`);
            vkey = response.data.key;
            updateTime = +new Date();
        } catch (ex) {
            error('Failed to update vkey: %O', ex);
        }
    }
    return vkey;
}

function getURL(data) {
    return `http://${baseUrl}/${data.prefix}${data.mid}.${data.type}?vkey=${vkey}&guid=${guid}&uin=0&fromtag=30`;
}

export default async(keyword, artists) => {
    debug(`Search '${keyword} - ${artists}' use QQ library.`);

    try {
        await updateVkey();
    } catch (ex) {
        error('Failed to initialize QQ plugin: %O', ex);
        throw ex;
    }

    var response = await axios.get(`${baseApi}/soso/fcgi-bin/client_search_cp?ct=24&qqmusic_ver=1298&new_json=1&remoteplace=txt.yqq.song&t=0&aggr=1&cr=1&catZhida=1&lossless=1&flag_qc=0&p=1&n=1&w=${encodeURIComponent(keyword)}&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`);
    var data = response.data;

    if (data.code !== 0
        || data.data.song.list.length === 0) {
        return;
    }

    for (let e of data.data.song.list) {
        let list = e.file;
        let song = {};

        // Match the artists
        if (e.singer.findIndex(e => artists.indexOf(e.name) === -1)) {
            continue;
        }

        if (list.size_128 > 0) {
            song.src = getURL({
                mid: list.media_mid,
                prefix: 'M500',
                type: 'mp3',
            });
        }

        if (list.size_320 > 0) {
            song.src = getURL({
                mid: list.media_mid,
                prefix: 'M800',
                type: 'mp3',
            });
        }

        return song;
    }
};
