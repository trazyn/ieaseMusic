
import { dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import _debug from 'debug';
import pkg from '../package.json';

let debug = _debug('dev:submodules:updater');
let error = _debug('dev:submodules:updater:error');

let downloading = false;
let alreadyAutoupdate = false;

function checkForUpdates(autoupdate = false) {
    if (downloading) {
        dialog.showMessageBox({
            type: 'info',
            buttons: ['OK'],
            title: pkg.name,
            message: `Downloading...`,
            detail: `Please leave the app open, the new version is downloading. You'll receive a new dialog when downloading is finished.`
        });

        return;
    }

    if (autoupdate || alreadyAutoupdate) {
        autoUpdater.checkForUpdates();
    } else {
        alreadyAutoupdate = true;
    }
}

function installAutoUpdater(done) {
    autoUpdater.on('checking-for-update', () => {
        debug('Checking for update...');
    });

    autoUpdater.on('update-not-available', e => {
        debug('Update not available.');

        // Do'nt show the message on app launched
        if (!alreadyAutoupdate) {
            alreadyAutoupdate = true;
            return;
        }

        dialog.showMessageBox({
            type: 'info',
            buttons: ['OK'],
            title: pkg.name,
            message: `${pkg.name} is up to date :)`,
            detail: `${pkg.name} ${pkg.version} is currently the newest version available, It looks like you're already rocking the latest version!`
        });
    });

    autoUpdater.on('update-available', e => {
        debug('Update available.');
        downloading = true;
        checkForUpdates();
    });

    autoUpdater.on('error', err => {
        dialog.showMessageBox({
            type: 'error',
            buttons: ['Cancel update'],
            title: pkg.name,
            message: `Failed to update ${pkg.name} :(`,
            detail: `An error occurred in retrieving update information, Please try again later.`,
        });

        downloading = false;
        error(err);
    });

    autoUpdater.on('update-downloaded', info => {
        var { releaseNotes, releaseName } = info;
        var index = dialog.showMessageBox({
            type: 'info',
            buttons: ['Restart', 'Later'],
            title: pkg.name,
            message: `The new version has been downloaded. Please restart the application to apply the updates.`,
            detail: `${releaseName}\n\n${releaseNotes}`
        });
        downloading = false;

        if (index === 1) {
            return;
        }

        autoUpdater.quitAndInstall();
        setTimeout(() => done());
    });
}

export default {
    installAutoUpdater,
    checkForUpdates,
};
