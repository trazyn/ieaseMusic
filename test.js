
var fs = require('fs');
var request = require('request');
var progress = require('request-progress');

// The options argument is optional so you can omit it
progress(request('http://m10.music.126.net/20180802031002/d714184e2ad3a2810b3634840f0cd976/ymusic/4620/b512/3f68/9c4197d9dff716887307900924991554.mp3'), {
    // throttle: 2000,                    // Throttle the progress event to 2000ms, defaults to 1000ms
    // delay: 1000,                       // Only start to emit after 1000ms delay, defaults to 0ms
    // lengthHeader: 'x-transfer-length'  // Length header to use, defaults to content-length
})
.on('progress', function (state) {
    // The state is an object that looks like this:
    // {
    //     percent: 0.5,               // Overall percent (between 0 to 1)
    //     speed: 554732,              // The download speed in bytes/sec
    //     size: {
    //         total: 90044871,        // The total payload size in bytes
    //         transferred: 27610959   // The transferred payload size in bytes
    //     },
    //     time: {
    //         elapsed: 36.235,        // The total elapsed seconds since the start (3 decimals)
    //         remaining: 81.403       // The remaining seconds to finish (3 decimals)
    //     }
    // }
    console.log('progress', state);
})
.on('error', function (err) {
    // Do something with err
})
.on('end', function () {
    // Do something after request finishes
    console.log('down');
})
.pipe(fs.createWriteStream('IE11.Win8.1.For.Windows.VirtualBox.zip'));
