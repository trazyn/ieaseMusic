
import API from 'simple-lastfm';

const API_KEY = 'c1f9a819c03a17083eba0fe9ee41119e';
const SECRET = '3742198243c490bf333d0aa615e5d117';

var lastfm;

async function getSession() {
    var success = await new Promise((resolve, reject) => {
        if (!lastfm) {
            resolve(false);
            return;
        }

        lastfm.getSessionKey(result => {
            resolve(result.success);
        });
    });

    if (!success) {
        return;
    }

    return lastfm;
}

async function initialize(username, password) {
    if (!username || !password) {
        return;
    }

    lastfm = new API({
        api_key: API_KEY,
        api_secret: SECRET,
        username,
        password,
    });

    return getSession();
}

async function scrobble(song) {
    var session = await getSession();

    if (!session) {
        return;
    }

    return new Promise((resolve, reject) => {
        session.scrobbleTrack({
            artist: song.artists.map(e => e.name).join(','),
            track: song.name,
            callback: (result) => resolve(result)
        });
    });
}

async function playing(song) {
    var session = await getSession();

    if (!session) {
        return;
    }

    return new Promise((resolve, reject) => {
        session.scrobbleNowPlayingTrack({
            artist: song.artists.map(e => e.name).join(','),
            track: song.name,
            callback: (result) => resolve(result)
        });
    });
}

async function love(song) {
    var session = await getSession();

    if (!session) {
        return;
    }

    return new Promise((resolve, reject) => {
        session.loveTrack({
            artist: song.artists.map(e => e.name).join(','),
            track: song.name,
            callback: (result) => resolve(result)
        });
    });
}

async function unlove(song) {
    var session = await getSession();

    if (!session) {
        return;
    }

    return new Promise((resolve, reject) => {
        session.unloveTrack({
            artist: song.artists.map(e => e.name).join(','),
            track: song.name,
            callback: (result) => resolve(result)
        });
    });
}

export default {
    initialize,
    scrobble,
    playing,
    love,
    unlove,
};
