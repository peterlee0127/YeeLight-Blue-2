var noble = require('noble');
var util = require('util');
var yeeDevice = require('./YeeDevice.js');

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
var allServices = [
    CONTROL_UUID,
    DELAY_UUID,
    DELAY_STATUS_QUERY_UUID,
    DELAY_STATUS_RESPONSE_UUID,
    STATUS_QUERY_UUID_UUID,
    STATUS_RESPONSE_UUID,
    COLORFLOW_UUID,
    LED_NAME_UUID,
    LED_NAME_RESPONSE_UUID,
    EFFECT_UUID
 ];



function startDiscover(devices){
    noble.on('stateChange', function(state) {
        if (state === 'poweredOn'){
            if(!Array.isArray(devices)) {
                console.log("please set startDiscover([])");
                process.exit();
            }
            discover(devices);
        }
        else{
            noble.stopScanning();
        }
    });
}
exports.startDiscover = startDiscover;

// id: 'a2264730c31a41449de4e0114e4a386d',
// address: '54:4a:16:1f:b2:2f',

function discover(devices){
    noble.startScanning([SERVICE_UUID]);
    noble.on('discover', function(peripheral) {
        var count = devices.length;
        for(var i = 0;i<count;i++) {
            var device = devices[i];
            if(device.macAddress==peripheral.address) {
                device.connectInfo = peripheral;
                connect(device,peripheral)
            }
        }
        if(count==0) {
            var id = peripheral.id;
            var macAddress = peripheral.address;
            var localName = peripheral.advertisement.localName;
            console.log("Discover YeeLight!!  macAddress:"+macAddress+"  id:"+id);
        }
    });
}

function connect(device,peripheral) {
    setTimeout(function(){
        peripheral.connect(function(error){
            if(error){console.log(error);}
            console.log("Connected YeeLight!! macAddress:"+peripheral.address);
            peripheral.discoverServices([SERVICE_UUID], function(error, services) {
                var deviceInformationService = services[0];
                deviceInformationService.discoverCharacteristics(allServices, function(error, characteristics) {
                    device.characteristics = [];
                    var dev = [];
                    for (var i in characteristics) {
                        dev.push(characteristics[i]);
                    }
                    device.characteristics = dev;
                    readLightInfo(device);
                });
            });
        });
    },200);
}

function readLightInfo(device) {
    var readChar = findForCharacters(device.characteristics, STATUS_RESPONSE_UUID);
    readChar.on('read', function(data, isNotification) {
        if(data != undefined){
            console.log(data + '%'+"  isNotification:"+isNotification);
        }
    });

    readChar.notify(true, function(error) {
        if(error){
            console.log(error);
        }
    });

    setTimeout(function(){
        var queryChar=findForCharacters(device.characteristics, STATUS_QUERY_UUID_UUID);
        queryChar.write(new Buffer('S'), false, function(error) {
            if(error){
                console.log(error);
            }
        });
    },1000);

}
exports.readLightInfo = readLightInfo;


function findForCharacters(characters,service_UUID){
    for(index in characters){
        if(characters[index].uuid==service_UUID){
            return characters[index];
        }
    }
};

exports.disConnectAll = function disConnectAll(){
    for (var index in noble._peripherals){
        noble._peripherals[index].disconnect(function(err){
            if(err){console.log(err); }
        });
    }
    allDevices = [];
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
