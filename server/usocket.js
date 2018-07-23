
import net from 'net';
import fs from 'fs';
import _debug from 'debug';

const SOCKET_FILENAME = '/var/tmp/ieasemusic.sock';
let debug = _debug('dev:usocket');
let error = _debug('dev:usocket:error');

function handler(data, player) {
    var payload = JSON.parse(data.toString());

    switch (payload.command) {
        case 'toggle':
            player.webContents.send('player-toggle');
            break;

        case 'next':
            player.webContents.send('player-next');
            break;

        case 'prev':
            player.webContents.send('player-previous');
            break;

        case 'play':
            player.webContents.send('player-play', {
                id: payload.id,
            });
            break;

        case 'changeMode':
            player.webContents.send('player-mode', {
                mode: payload.mode,
            });
            break;

        case 'goodbye':
            player.goodbye();
            break;

        case 'show':
            let isVisible = player.isVisible();
            isVisible ? player.hide() : player.show();
            break;

        case 'bug':
            require('electron').shell.openExternal('https://github.com/trazyn/ieaseMusic/issues');
            break;
    }
}

function createServer(shared, player) {
    fs.unlink(SOCKET_FILENAME, () => {
        var server = net.createServer(
            s => {
                debug('🐶 Client connected >>>');

                s.on('end', () => debug('🐱 Client disconnected <<<'));
                s.on('data', data => handler(data, player));
                s.on('error', err => console.error(err));
                s.write(JSON.stringify(shared));
            }
        );

        server.on(
            'error',
            err => {
                error(err);
            }
        );

        server.listen(
            SOCKET_FILENAME,
            () => {
                debug('🐤 Server bound on %s', SOCKET_FILENAME);
            }
        );
    });
}

export default createServer;
