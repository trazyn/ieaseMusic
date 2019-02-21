
import _debug from 'debug';
import chalk from 'chalk';

const debug = _debug('dev:plugin:Xiami');
const headers = {
    cookie: 'user_from=2;XMPLAYER_addSongsToggler=0;XMPLAYER_isOpen=0;_xiamitoken=cb8bfadfe130abdbf5e2282c30f0b39a;',
    referer: 'http://h.xiami.com/',
    user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.75 Safari/537.36',
};

export default async(request, keyword, artists) => {
    debug(chalk.black.bgGreen('💊  Loaded Xiami music.'));

    try {
        var response = await request({
            uri: 'http://api.xiami.com/web',
            qs: {
                v: '2.0',
                key: [keyword].concat(artists.split(',')).join('+'),
                limit: 100,
                page: 1,
                r: 'search/songs',
                app_key: 1,
            },
            json: true,
            headers,
        });

        var data = response.data;

        if (response.state !== 0
            || data.songs.length === 0) {
            return Promise.reject(Error(404));
        }

        for (let e of data.songs) {
            if (
                artists.split(',').findIndex(
                    artist => e.artist_name.indexOf(artist) !== -1
                ) === -1
            ) {
                continue;
            }

            let song = e;

            song.src = e.listen_file;

            if (!song.src) {
                return Promise.reject(Error(404));
            } else {
                return song;
            }
        }
    } catch (ex) {
        return Promise.reject(ex);
    }

    return Promise.reject(Error(405));
};
