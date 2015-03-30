var noble = require('noble');
var util = require('util');

var SERVICE_UUID          = 'fff0';  // for yeeLight service
var CONTROL_UUID          = 'fff1';  // for control
var DELAY_UUID            = 'fff2';  // set delay on/off for LED
var STATUS_QUERY_UUID     = 'fff3';  // query the status of delay on/off
var STATUS_RESPONSE_UUID  = 'fff4';  // notify the status of delay on/off


var EFFECT_UUID           = 'fffc';  // set the effect of color change

var allDevices = [];
var currentDevices = [];

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
        if(error){console.log(error);return;}
        console.log('Connected:', localName," Address:",macAddress);
        peripheral.discoverServices([SERVICE_UUID,CONTROL_UUID,EFFECT_UUID], function(error, services) {
            var deviceInformationService = services[0];
            deviceInformationService.discoverCharacteristics([CONTROL_UUID], function(error, characteristics) {
                  // for (var i in characteristics) {
                    if(characteristics[0].uuid==CONTROL_UUID){
                        allDevices.push(characteristics[0]);
                    } // is CONTROL_UUID
                  // }
            });
        });
    });
});

exports.randomColor = function randomColor(){
  currentDevices=allDevices;
  for(var index in currentDevices){
    setTimeout(function () {
      controlLight(currentDevices[index],Math.floor((Math.random() * 255) + 1),Math.floor((Math.random() * 255) + 1),Math.floor((Math.random() * 255) + 1),100);
      randomColor();
    }, 200);
  }
};

exports.turnOff = function turnOff(){
  currentDevices=allDevices;
  for(var index in currentDevices){
    controlLight(characteristics[index],0,0,0,0);
  }
};

exports.turnOn = function turnOn(){
  currentDevices=allDevices;
  for(var index in currentDevices){
    controlLight(currentDevices[index],255,255,255,100);
  }
};

exports.changeColor = function changeColor(red,green,blue,brightness){
  currentDevices=allDevices;
  for(var index in currentDevices){
    controlLight(currentDevices[index],red,green,blue,brightness);
  }
};


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
