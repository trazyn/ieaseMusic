
import fs from 'fs';
import PacProxyAgent from 'pac-proxy-agent';
import Netease from './Netease';
import QQ from './QQ';
import MiGu from './MiGu';
import Kugou from './Kugou';
import Baidu from './Baidu';
import Xiami from './Xiami';
import Kuwo from './Kuwo';
import storage from '../../common/storage';
import cache from '../../common/cache';

async function getPreferences() {
    return await storage.get('preferences') || {};
}

async function exe(plugins, ...args) {
    var preferences = await getPreferences();
    var rpOptions = {
        timeout: 10000,
        json: true,
        jar: true,
    };
    var proxy = preferences.proxy;
    var rp = require('request-promise-native').defaults(rpOptions);

    return Promise.all(
        plugins.map(e => {
            if (proxy && e.proxy) {
                if (proxy.endsWith('.pac')) {
                    Object.assign(
                        rpOptions,
                        {
                            agent: new PacProxyAgent(proxy)
                        }
                    );
                } else {
                    Object.assign(
                        rpOptions,
                        {
                            proxy,
                        }
                    );
                }
            }
            // If a request failed will keep waiting for other possible successes, if a request successed,
            // treat it as a rejection so Promise.all immediate break.
            return e.enginner(rp, ...args).then(
                val => Promise.reject(val),
                err => Promise.resolve(err)
            );
        })
    ).then(
        errs => Promise.reject(errs),
        val => Promise.resolve(val),
    );
}

async function getFlac(keyword, artists, id) {
    try {
        var song = cache.get(id);
        if (!song) {
            song = (await exe([QQ], keyword, artists, true)) || {};
            if (song.src) {
                cache.set(id, song);
            }
        }

        return song;
    } catch (ex) {
        // 404
    }
}

async function loadFromLocal(id) {
    var downloaded = (await storage.get('downloaded')) || {};
    var task = downloaded[id];

    if (task) {
        if (fs.existsSync(task.path) === false) {
            delete downloaded[id];
            await storage.set('downloaded', downloaded);
            return;
        }

        return {
            src: encodeURI(`file://${task.path}`)
        };
    }
}

async function getTrack(keyword, artists, id /** This id is only work for netease music */) {
    var preferences = await getPreferences();
    var enginers = preferences.enginers;
    var plugins = [{
        enginner: Netease,
        proxy: false,
    }];

    if (!enginers) {
        enginers = {
            'QQ': true,
            'MiGu': true,
            'Kuwo': true,
            'Xiami': false,
            'Kugou': false,
            'Baidu': true,
        };
    }

    var key = Object.keys(enginers).sort().map(e => enginers[e] ? e.toUpperCase() : '').join('') + '#' + id;
    var song = cache.get(key);
    if (!song) {
        if (enginers['QQ']) {
            plugins.push({
                enginner: QQ,
                proxy: true,
            });
        }

        if (enginers['MiGu']) {
            plugins.push({
                enginner: MiGu,
                proxy: true,
            });
        }

        if (enginers['Xiami']) {
            plugins.push({
                enginner: Xiami,
                proxy: true,
            });
        }

        if (enginers['Kugou']) {
            plugins.push({
                enginner: Kugou,
                proxy: true,
            });
        }

        if (enginers['Baidu']) {
            plugins.push({
                enginner: Baidu,
                proxy: true,
            });
        }

        if (enginers['Kuwo']) {
            plugins.push({
                enginner: Kuwo,
                proxy: true,
            });
        }

        song = (await exe(plugins, keyword, artists, id)) || {};
        // Cache the search result
        if (song.src) {
            cache.set(key, song);
        }
    }

    return song;
}

export {
    loadFromLocal,
    getFlac,
    getTrack,
};
