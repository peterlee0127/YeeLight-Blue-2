var noble = require('noble');
var util = require('util');

var SERVICE_UUID                = 'fff0';  // for yeeLight service

var CONTROL_UUID                = 'fff1';  // for control
var DELAY_UUID                  = 'fff2';  // set delay on/off for LED
var DELAY_STATUS_QUERY_UUID     = 'fff3';  // query the status of delay on/off
var DELAY_STATUS_RESPONSE_UUID  = 'fff4';  // notify the status of delay on/off
var STATUS_QUERY_UUID_UUID      = 'fff5';  // query thhe status of delay on/off
var STATUS_RESPONSE_UUID        = 'fff6';  // notify the status LED
var COLORFLOW_UUID              = 'fff7';  // set the color flow for LED
var LED_NAME_UUID               = 'fff8';  // set the name of LED
var LED_NAME_RESPONSE_UUID      = 'fff9';  // notify the name of LED
var EFFECT_UUID                 = 'fffc';  // set the effect of color change

var allDevices = [];
var allServices = [  CONTROL_UUID,
                  DELAY_UUID,
                  DELAY_STATUS_QUERY_UUID,
                  DELAY_STATUS_RESPONSE_UUID,
                  STATUS_QUERY_UUID_UUID,
                  STATUS_RESPONSE_UUID,
                  COLORFLOW_UUID,
                  LED_NAME_UUID,
                  LED_NAME_RESPONSE_UUID,
                  EFFECT_UUID             ];

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
        if(error){console.log(error);}
        console.log('Connected:', localName," Address:",macAddress);
        peripheral.discoverServices([SERVICE_UUID], function(error, services) {
            var deviceInformationService = services[0];
            deviceInformationService.discoverCharacteristics(allServices, function(error, characteristics) {
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

};

exports.TurnOn = function turnOn(){
  for(var index in allDevices){
    controlLight(allDevices[index],255,255,255,100);
  }
};


exports.TurnOff = function turnOff(){
  for(var index in allDevices){
    controlLight(allDevices[index],null,null,null,0);
  }
};


exports.changeColor = function changeColor(red,green,blue,brightness){
  for(var index in allDevices){
    controlLight(allDevices[index],red,green,blue,brightness);
  }
};


function controlLight(characteristics,red,green,blue,brightness){
  var command = util.format('%d,%d,%d,%d', red, green, blue, brightness);
   for (var j = command.length; j < 18; j++) {
     command += ',';
   }
  characteristics.write(new Buffer(command), false, function(error) {
    if(error){console.log(error);}
  });
}
