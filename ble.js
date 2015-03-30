var noble = require('noble');
var util = require('util');

var SERVICE_UUID          = 'fff0';
var CONTROL_UUID          = 'fff1';
var EFFECT_UUID           = 'fffc';

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning([SERVICE_UUID]);
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {
  var macAddress = peripheral.uuid;
  // var rss = peripheral.rssi;
  var localName = peripheral.advertisement.localName;
    peripheral.connect(function(error){
        if(error){
          console.log(error);return;
        }
        console.log('Connected:', localName," Address:",macAddress);
        peripheral.discoverServices([SERVICE_UUID,CONTROL_UUID,EFFECT_UUID], function(error, services) {
            var deviceInformationService = services[0];
            deviceInformationService.discoverCharacteristics([CONTROL_UUID], function(error, characteristics) {
                  // for (var i in characteristics) {
                    if(characteristics[0].uuid==CONTROL_UUID){
                        // controlLight(characteristics[i],255,255,255,100);
                        randomColor(characteristics[0]);

                    } // is CONTROL_UUID
                  // }
            });
        });
    });
});

function randomColor(characteristics){
  setTimeout(function () {
    controlLight(characteristics,Math.floor((Math.random() * 255) + 1),Math.floor((Math.random() * 255) + 1),Math.floor((Math.random() * 255) + 1),100);
    randomColor(characteristics);
  }, 200);
}

function turnOff(characteristics){
  controlLight(characteristics,0,0,0,0);
}

function turnOn(characteristics){
  controlLight(characteristics,255,255,255,100);
}

function controlLight(characteristics,red,green,blue,brightness){
  var command = util.format('%d,%d,%d,%d', red, green, blue, brightness);
   for (var j = command.length; j < 18; j++) {
     command += ',';
   }
  characteristics.write(new Buffer(command), false, function(error) {
    if(error){console.log(error);return;}
      // console.log('successful');
  });
}
