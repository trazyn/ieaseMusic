
import storage from 'electron-json-storage';
import Netease from './Netease';
import QQ from './QQ';
import MiGu from './MiGu';
import Kugou from './Kugou';
import Baidu from './Baidu';
import Xiami from './Xiami';
import Kuwo from './Kuwo';

async function getPreferences() {
    return new Promise(resolve => {
        storage.get('preferences', (err, data) => {
            resolve(err ? {} : data);
        });
    });
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
    getFlac,
    getTrack,
};
