
import storage from 'electron-json-storage';
import QQ from './QQ';
import Kugou from './Kugou';
import Baidu from './Baidu';
import Xiami from './Xiami';
import _debug from 'debug';

const debug = _debug('dev:plugin');

async function getEnginers() {
    return new Promise(resolve => {
        storage.get('preferences', (err, data) => {
            var fallback = {
                'QQ': true,
                'Xiami': true,
                'Kugou': false,
                'Baidu': true,
            };

            var enginers = fallback;

            if (!err) {
                enginers = data.enginers || fallback;
            }

            resolve(enginers);
        });
    });
}

export default async(keyword, artists) => {
    var enginers = await getEnginers();
    var plugins = [];

    if (enginers['QQ']) {
        plugins.push(QQ);
        debug('Loaded plugin QQ');
    }

    if (enginers['Xiami']) {
        plugins.push(Xiami);
        debug('Loaded plugin Xiami');
    }

    if (enginers['Kugou']) {
        plugins.push(Kugou);
        debug('Loaded plugin Kugou');
    }

    if (enginers['Baidu']) {
        plugins.push(Baidu);
        debug('Loaded plugin Baidu');
    }

    debug('Plugin has loaded, search: \'%s\', \'%s\'', keyword, artists);

    return Promise.all(
        plugins.map(e => {
            // If a request failed will keep waiting for other possible successes, if a request successed,
            // treat it as a rejection so Promise.all immediate break.
            return e(keyword, artists).then(
                val => Promise.reject(val),
                err => Promise.resolve(err)
            );
        })
    ).then(
        errs => Promise.reject(errs),
        val => Promise.resolve(val),
    );
};
