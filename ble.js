var noble = require('noble');
var util = require('util');
var server = require('./server.js');



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
var allServices = [ CONTROL_UUID,
                    DELAY_UUID,
                    DELAY_STATUS_QUERY_UUID,
                    DELAY_STATUS_RESPONSE_UUID,
                    STATUS_QUERY_UUID_UUID,
                    STATUS_RESPONSE_UUID,
                    COLORFLOW_UUID,
                    LED_NAME_UUID,
                    LED_NAME_RESPONSE_UUID,
                    EFFECT_UUID             ];

var numberOfYeelights = 0;
exports.numberOfYeelights = numberOfYeelights;


function startDiscover(){
  noble.startScanning([SERVICE_UUID]);
  noble.on('discover', function(peripheral) {
    var macAddress = peripheral.uuid;// var rss = peripheral.rssi;
    var localName = peripheral.advertisement.localName;
      peripheral.connect(function(error){
          if(error){console.log(error);}
          peripheral.discoverServices([SERVICE_UUID], function(error, services) {
              var deviceInformationService = services[0];
              deviceInformationService.discoverCharacteristics(allServices, function(error, characteristics) {
                    var device = [];
                    for (var i in characteristics) {
                        device.push(characteristics[i]);
                    }
                    allDevices.push(device);
                    numberOfYeelights++;
                    server.numberOfYeelightsChanges(numberOfYeelights);
                    /*
                    var readChar=findForCharacters(device,STATUS_RESPONSE_UUID);
                    readChar.read(function(error, data) {
                      // data is a buffer
                        if(error){console.log(error); }
                        if(data) {console.log(data);  	}
                    });
                    readChar.on('read', function(data, isNotification) {
                      if(data != undefined){
                      	 console.log('current setting:', data + '%');
                      }
                    });
                    readChar.notify(true, function(error) {
                        if(error){
                	     	 	 console.log(error);
                        }
                    });
                    var queryChar=findForCharacters(device,STATUS_QUERY_UUID_UUID);
                    queryChar.write(new Buffer('S'), false, function(error) {
                      if(error){console.log(error);}
                    });
                    */
              });
          });
      });
  });
}
exports.startDiscover = startDiscover;

exports.disConnectAll = function disConnectAll(){
    for (var index in noble._peripherals){
      noble._peripherals[index].disconnect(function(err){
          if(err){console.log(err); }
      });
    }
    numberOfYeelights = 0;
    allDevices = [];
};


function findForCharacters(characters,Service_UUID){
  for(index in characters){
    if(characters[index].uuid==Service_UUID){
        return characters[index];
    }
  }
};


exports.randomColor = function randomColor(){

};

exports.TurnOn = function turnOn(){
  for(var index in allDevices){
    
      var chcharacter=findForCharacters(allDevices[index],CONTROL_UUID);
      controlLight(chcharacter,255,255,255,100);
//     var command = util.format('%d,%d,%d,%d', red, green, blue, brightness);
//     for (var j = command.length; j < 18; j++) {
//       command += ',';
//     }
//    chcharacter.write(new Buffer("CLTMP 6500,45,,,,,,%"), false, function(error) {
//      if(error){console.log(error);}
//    });

      //CLTMP 6500,45,,,,,,%
  }
};


exports.TurnOff = function turnOff(){
  for(var index in allDevices){
      var chcharacter=findForCharacters(allDevices[index],CONTROL_UUID);
      controlLight(chcharacter,null,null,null,0);
  }
};


exports.changeColor = function changeColor(red,green,blue,brightness){
  for(var index in allDevices){
    var chcharacter=findForCharacters(allDevices[index],CONTROL_UUID);
    controlLight(chcharacter,red,green,blue,brightness);
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
