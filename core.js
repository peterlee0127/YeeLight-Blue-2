var yeeLight = require('./ble.js');
var yeeDevice = require('./YeeDevice.js');
require('events').EventEmitter.prototype._maxListeners = 0


var tableLight = yeeDevice("桌燈","54:4a:16:1f:a6:cd");
// firstLight.();

yeeLight.startDiscover(tableLight);
