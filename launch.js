const open = require('open');

const SERVER = 'http://localhost:8000';

(async () => {

    console.log('Openning site -- ' + SERVER);
    await open(SERVER, {app: ['google chrome', '--incognite']});
})();
