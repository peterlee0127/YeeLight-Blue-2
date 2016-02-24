var yeeLight = require('./ble.js');
var yeeDevice = require('./YeeDevice.js');
require('events').EventEmitter.prototype._maxListeners = 0


var tableLight = yeeDevice("桌燈","54:4a:16:1f:a6:cd");

//macAddress:a2264730c31a41449de4e0114e4a386d
// macAddress:f0c7821732a64239a8205562191867f4
// macAddress:b101f818a8274faabbfd3f9c19a0a84c

yeeLight.startDiscover([tableLight]);
