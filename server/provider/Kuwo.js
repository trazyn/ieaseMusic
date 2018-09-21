
import _debug from 'debug';
import chalk from 'chalk';

const debug = _debug('dev:plugin:Kuwo');
const error = _debug('dev:plugin:Kuwo:error');

export default async(request, keyword, artists) => {
    debug(chalk.black.bgGreen('💊  Loaded Kuwo music.'));

    try {
        // Apply cookie
        await request({
            uri: 'http://www.kuwo.cn/',
            method: 'HEAD',
        });

        var response = await request({
            uri: 'http://search.kuwo.cn/r.s',
            qs: {
                ft: 'music',
                itemset: 'web_2013',
                client: 'kt',
                rformat: 'json',
                encoding: 'utf8',
                all: [keyword].concat(artists.split(',')).join('+'),
                pn: 0,
                rn: 20,
            },
        });
        // eslint-disable-next-line
        response = eval('(' + response + ')');
        artists = artists.split(',');

        var songs = response.abslist || [];
        var payload = songs.find(
            e => artists.findIndex(artist => e.ARTIST.indexOf(artist) !== -1) > -1
        );

        if (!payload) {
            error(chalk.black.bgRed('🚧  Nothing.'));
            return Promise.reject(Error(404));
        }

        response = await request({
            uri: 'http://antiserver.kuwo.cn/anti.s',
            qs: {
                type: 'convert_url',
                format: 'aac|mp3|wma',
                response: 'url',
                rid: payload.MP3RID,
            },
        });

        if (!response || response === 'IPDeny') {
            error(chalk.black.bgRed('🚧  Nothing.'));
            return Promise.reject(Error(404));
        }

        var song = {
            src: response,
            isFlac: response.endsWith('.aac')
        };

        debug(chalk.black.bgGreen('🚚  Result >>>'));
        debug(song);
        debug(chalk.black.bgGreen('🚚  <<<'));
    } catch (ex) {
        // Anti-warnning
        error('Failed to get song: %O', ex);
        return Promise.reject(ex);
    }

    return song;
};
