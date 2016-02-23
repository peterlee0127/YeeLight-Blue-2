var Yeelight = function(displayName, address) {
    this.displayName = displayName;
    this.address = address;
    return this;
}
// properties and methods
Yeelight.prototype = {
    name:"Yeelight",
    displayName:"Yeelight",
    uuid:"",
    address:"",
    color:[255,255,255], // red,green,blue
    brightness:0,
    connected:false,
    connectInfo:Object,
};
// node.js module export
module.exports = Yeelight;
