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

                  for (var i in characteristics) {
                    // console.log('  ' + i + ' uuid: ' + characteristics[i].uuid);
                    if(characteristics[i].uuid==CONTROL_UUID){
                      var red = 255;
                      var green = 255;
                      var blue = 255;
                      var brightness = 100;
                      var command = util.format('%d,%d,%d,%d', red, green, blue, brightness);
                     for (var j = command.length; j < 18; j++) {
                       command += ',';
                     }
                      characteristics[i].write(new Buffer(command), false, function(error) {
                        if(error){console.log(error);return;}
                          console.log('set alert level to mid (1)');
                      });
                    }
                  }
            });
        });


    });
});
