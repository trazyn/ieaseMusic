
import QQ from './QQ';
import Kugou from './Kugou';
import Baidu from './Baidu';
import _debug from 'debug';

const debug = _debug('dev:plugin');

export default (keyword, artists) => {
    var plugins = [Baidu, QQ, Kugou];

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
