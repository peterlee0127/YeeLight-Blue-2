var yeelight = require('./ble.js');
var YeeDevice = require('./YeeDevice.js');
require('events').EventEmitter.prototype._maxListeners = 0


var firstLight = YeeDevice("桌燈","54:4a:16:1f:a6:cd");
// firstLight.method();
// firstLight.();

yeelight.startDiscover();
