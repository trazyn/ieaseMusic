
import express from 'express';
import axios from 'axios';
import crypto from 'crypto';
import _debug from 'debug';

const debug = _debug('dev:api');
const error = _debug('dev:error');
const router = express();

// https://github.com/skyline75489/nmdown/blob/ee0f66448b6e64f8b9bdb2f7451a8d4ff63e14c4/cloudmusic/hasher.py
function id2url(id) {
    var key = '3go8&$8*3*3h0k(2)2';
    var keyCodes = Array.from(key).map((e, i) => key.charCodeAt(i));
    var fidCodes = Array.from(id).map((e, i) => id.charCodeAt(i));

    var hashCodes = [];

    for (let i = 0; i < fidCodes.length; i++) {
        let code = (fidCodes[i] ^ keyCodes[i % key.length]) & 0XFF;
        hashCodes.push(code);
    }

    var string = hashCodes.map((e, i) => String.fromCharCode(hashCodes[i])).join('');
    var md5 = crypto.createHash('md5').update(string).digest();
    var result = Buffer.from(md5).toString('base64').replace(/\//g, '_').replace(/\+/g, '-');

    return `https://p4.music.126.net/${result}/${id}.jpg?param=y177y177`;
}

async function getArtist(id) {
    var profile = {};
    var songs = [];

    try {
        let response = await axios.get(`/artists?id=${id}`);
        let data = response.data;

        if (data.code !== 200) {
            throw data;
        } else {
            profile = data.artist;

            profile = {
                id: profile.id.toString(),
                uid: profile.accountId,
                name: profile.name,
                background: profile.picUrl + '?param=640y300',
                followed: profile.followed,
                size: {
                    song: profile.musicSize,
                    mv: profile.mvSize,
                    album: profile.albumSize,
                },
            };
            songs = data.hotSongs.map(e => {
                // eslint-disable-next-line
                var { al /* Album */, ar /* Artist */ } = e;

                return {
                    id: e.id.toString(),
                    name: e.name,
                    duration: e.dt,
                    album: {
                        id: al.id.toString(),
                        name: al.name,
                        cover: id2url(al.pic_str),
                        link: `/player/1/${al.id}`
                    },
                    artists: ar.map(e => ({
                        id: e.id.toString(),
                        name: e.name,
                        // Broken link
                        link: e.id ? `/artist/${e.id}` : '',
                    }))
                };
            });
        }
    } catch (ex) {
        error('Failed to get artist: %O', ex);
    }

    return {
        profile,
        playlist: {
            id: profile.id.toString(),
            name: `TOP 50 - ${profile.name}`,
            size: 50,
            songs,
        }
    };
}

async function getAlbums(id) {
    var albums = [];

    try {
        let response = await axios.get(`/artist/album?id=${id}&limit=999`);
        let data = response.data;

        if (data.code !== 200) {
            throw data;
        } else {
            albums = data.hotAlbums.map(e => ({
                id: e.id.toString(),
                name: e.name,
                cover: e.picUrl,
                link: `/player/1/${e.id}`,
                publishTime: e.publishTime,
            }));
        }
    } catch (ex) {
        error('Failed to get albums: %O', ex);
    }

    return albums;
}

async function getSimilar(id) {
    var similar = [];

    try {
        let response = await axios.get(`/simi/artist?id=${id}`);
        let data = response.data;

        if (data.code !== 200) {
            throw data;
        } else {
            similar = data.artists.map(e => ({
                id: e.id.toString(),
                name: e.name,
                avatar: e.picUrl,
                publishTime: e.publishTime,
                // Broken link
                link: e.id ? `/artist/${e.id}` : '',
            }));
        }
    } catch (ex) {
        error('Failed to get similar artists: %O', ex);
    }

    return similar;
}

router.get('/unfollow/:id', async(req, res) => {
    debug('Handle request for /artist/unfollow');

    var id = req.params.id;
    var success = false;

    debug('Params \'id\': %s', id);

    try {
        let response = await axios.get(`/artist/sub/?id=${id}&&t=0`);
        let data = response.data;

        success = data.code === 200;

        if (data.code !== 200) {
            throw data;
        }
    } catch (ex) {
        error('Failed to unfollow artist: %O', ex);
    }

    res.send({
        success,
    });
});

router.get('/follow/:id', async(req, res) => {
    debug('Handle request for /artist/follow');

    var id = req.params.id;
    var success = false;

    debug('Params \'id\': %s', id);

    try {
        let response = await axios.get(`/artist/sub/?id=${id}&&t=1`);
        let data = response.data;

        success = data.code === 200;

        if (data.code !== 200) {
            throw data;
        }
    } catch (ex) {
        error('Failed to follow artist: %O', ex);
    }

    res.send({
        success,
    });
});

router.get('/:id', async(req, res) => {
    debug('Handle request for /artist');

    var id = req.params.id;

    debug('Params \'id\': %s', id);

    res.send({
        ...(await getArtist(id)),

        albums: await getAlbums(id),
        similar: await getSimilar(id),
    });
});

module.exports = router;
