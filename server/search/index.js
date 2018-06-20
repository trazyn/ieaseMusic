
import storage from 'electron-json-storage';
import QQ from './QQ';
import MiGu from './MiGu';
import Kugou from './Kugou';
import Baidu from './Baidu';
import Xiami from './Xiami';

async function getPreferences() {
    return new Promise(resolve => {
        storage.get('preferences', (err, data) => {
            resolve(err ? {} : data);
        });
    });
}

export default async(keyword, artists) => {
    var preferences = await getPreferences();
    var enginers = preferences.enginers;
    var rpOptions = {
        timeout: 3000,
        json: true,
    };
    var plugins = [];

    if (!enginers) {
        enginers = {
            'QQ': true,
            'MiGu': true,
            'Xiami': true,
            'Kugou': false,
            'Baidu': true,
        };
    }

    if (preferences.proxy) {
        Object.assign(
            rpOptions,
            {
                proxy: preferences.proxy,
            }
        );
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

    var rp = require('request-promise-native').defaults(rpOptions);

    return Promise.all(
        plugins.map(e => {
            // If a request failed will keep waiting for other possible successes, if a request successed,
            // treat it as a rejection so Promise.all immediate break.
            return e(rp, keyword, artists).then(
                val => Promise.reject(val),
                err => Promise.resolve(err)
            );
        })
    ).then(
        errs => Promise.reject(errs),
        val => Promise.resolve(val),
    );
};
