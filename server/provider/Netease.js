
import _debug from 'debug';
import chalk from 'chalk';
import config from '../../config';

const debug = _debug('dev:plugin:Netease');

export default async(request, keyword, artists, id) => {
    debug(chalk.black.bgGreen('💊  Loaded Netease music.'));

    try {
        var response = await request({
            uri: `http://127.0.0.1:${config.api.port}/song/url`,
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

        if (!song.url) {
            return Promise.reject(Error(404));
        }

        song = {
            id: song.id.toString(),
            src: `https://music.163.com/song/media/outer/url?id=${song.id.toString()}.mp3`,
            md5: song.md5,
            bitRate: song.br,
        };
    } catch (ex) {
        return Promise.reject(ex);
    }

    return song;
};
