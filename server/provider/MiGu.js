
import _debug from 'debug';
import chalk from 'chalk';

const debug = _debug('dev:plugin:MiGu');

export default async(request, keyword, artists) => {
    debug(chalk.black.bgGreen('💊  Loaded MiGu music.'));

    try {
        var response = await request({
            uri: 'http://m.music.migu.cn/migu/remoting/scr_search_tag',
            qs: {
                keyword: [keyword].concat(artists.split(',')).join('+'),
                type: 2,
                rows: 20,
                pgc: 1,
            }
        });

        if (
            false
            || response.success !== true
            || !response.musics
            || response.musics.length === 0
        ) {
            return Promise.reject(Error(404));
        }

        for (let e of response.musics) {
            if (
                artists.split(',').find(
                    artist => e.singerName.indexOf(artist) !== -1
                )
            ) {
                return Object.assign({}, e, { src: e.mp3 });
            }
        }
    } catch (ex) {
        return Promise.reject(ex);
    }

    return Promise.reject(Error(405));
};
