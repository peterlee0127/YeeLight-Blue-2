var noble = require('noble');

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
  var rss = peripheral.rssi;
  var localName = peripheral.advertisement.localName;

    peripheral.connect(function(error){
        if(error){
          console.log(error);return;
        }
        console.log('Connected:', localName," Address:",macAddress);
        peripheral.discoverServices([SERVICE_UUID,CONTROL_UUID], function(error, services) {
        var deviceInformationService = services[0];
        console.log('discovered device information service');
        deviceInformationService.discoverCharacteristics(null, function(error, characteristics) {
        console.log('discovered the following characteristics:');
            for (var i in characteristics) {
              console.log('  ' + i + ' uuid: ' + characteristics[i].uuid);
            }
          });
        });


    });
});
