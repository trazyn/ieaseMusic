
import _debug from 'debug';
import chalk from 'chalk';
import md5 from 'md5';

const debug = _debug('dev:plugin:Kugou');
const error = _debug('dev:plugin:Kugou:error');

let rp;

async function getURL(hash) {
    var key = md5(`${hash}kgcloud`);

    var response = await rp({
        url: `http://trackercdn.kugou.com/i/?acceptMp3=1&cmd=4&pid=6&hash=${hash}&key=${key}`,
    });

    if (response.error
        || +response.status !== 1) {
        error(chalk.black.bgRed('🚧  Nothing.'));
        return false;
    } else {
        return response;
    }
}

export default async(request, keyword, artists) => {
    debug(chalk.black.bgGreen('💊  Loaded Kugou music.'));

    rp = request;

    try {
        var response = await rp({
            uri: 'http://mobilecdn.kugou.com/api/v3/search/song',
            qs: {
                format: 'json',
                keyword: [keyword].concat(artists.split(',')).join('+'),
                page: 1,
                pagesize: 1,
                showtype: 1,
            },
        });

        var data = response.data;

        if (response.status !== 1
            || data.info.length === 0) {
            error(chalk.black.bgRed('🚧  Nothing.'));
            return Promise.reject(Error(404));
        }

        for (let e of data.info) {
            if (
                artists.split(',').findIndex(
                    artist => e.singername.indexOf(artist) > -1
                ) === -1
            ) {
                continue;
            }

            debug(chalk.black.bgGreen('🚚  Result >>>'));
            debug(e);
            debug(chalk.black.bgGreen('🚚  <<<'));

            let song = await getURL(e['320hash'] || e['hash']);

            if (song) {
                song.src = song.url;
                return song;
            }
        }
    } catch (ex) {
        error('Failed to get song: %O', ex);
        return Promise.reject(ex);
    }

    error(chalk.black.bgRed('🈚  Not Matched'));
    return Promise.reject(Error(405));
};
