var Yeelight = function(displayName, macAddress) {
    this.displayName = displayName;
    this.macAddress = macAddress;
    return this;
}
// properties and methods
Yeelight.prototype = {
    name:"Yeelight",
    displayName:"Yeelight",
    id:"",
    macAddress:"",
    color:[255,255,255], // red,green,blue
    brightness:0,
    connected:false,
    characteristics:[],
};

module.exports = Yeelight;
