
import _debug from 'debug';
import chalk from 'chalk';
import config from '../../config';

const debug = _debug('dev:plugin:Netease');
const error = _debug('dev:plugin:Netease:error');

export default async(request, keyword, artists, id) => {
    debug(chalk.black.bgGreen('💊  Loaded Netease music.'));

    try {
        var response = await request({
            uri: `http://127.0.0.1:${config.api.port}/music/url`,
            qs: {
                id,
            }
        });
        var song = {};

        if (
            false
            || response.code !== 200
            || (!response.data || response.data.length === 0)
        ) {
            return Promise.reject(Error(404));
        }

        song = response.data[0];

        song = {
            id: song.id.toString(),
            src: song.url,
            md5: song.md5,
            bitRate: song.br,
        };

        if (!song.src) {
            return Promise.reject(Error(404));
        }

        debug(chalk.black.bgGreen('🚚  Result >>>'));
        debug(song);
        debug(chalk.black.bgGreen('🚚  <<<'));
    } catch (ex) {
        error('Failed to get song: %O', ex);
        return Promise.reject(ex);
    }

    return song;
};
