
import fs from 'fs';
import Netease from './Netease';
import QQ from './QQ';
import MiGu from './MiGu';
import Kugou from './Kugou';
import Baidu from './Baidu';
import Xiami from './Xiami';
import Kuwo from './Kuwo';
import storage from '../../common/storage';

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

    if (preferences.proxy) {
        Object.assign(
            rpOptions,
            {
                proxy: preferences.proxy,
            }
        );
    }
    var rp = require('request-promise-native').defaults(rpOptions);

    return Promise.all(
        plugins.map(e => {
            // If a request failed will keep waiting for other possible successes, if a request successed,
            // treat it as a rejection so Promise.all immediate break.
            return e(rp, ...args).then(
                val => Promise.reject(val),
                err => Promise.resolve(err)
            );
        })
    ).then(
        errs => Promise.reject(errs),
        val => Promise.resolve(val),
    );
}

async function getFlac(keyword, artists) {
    return exe([QQ], keyword, artists, true);
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
    var plugins = [Netease];

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

    if (enginers['QQ']) {
        plugins.push(QQ);
    }

    if (enginers['MiGu']) {
        plugins.push(MiGu);
    }

    if (enginers['Xiami']) {
        plugins.push(Xiami);
    }

    if (enginers['Kugou']) {
        plugins.push(Kugou);
    }

    if (enginers['Baidu']) {
        plugins.push(Baidu);
    }

    if (enginers['Kuwo']) {
        plugins.push(Kuwo);
    }

    return exe(plugins, keyword, artists, id);
}

export {
    loadFromLocal,
    getFlac,
    getTrack,
};
