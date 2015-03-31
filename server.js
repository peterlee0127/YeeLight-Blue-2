var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var yeelight = require('./ble.js');
require('events').EventEmitter.prototype._maxListeners = 40;
app.setMaxListeners(0);
io.sockets.setMaxListeners(0);

app.use(express.static(__dirname, '/web'));

io.on('connection', function(socket){
  // console.log('a user connected');
  socket.on('changeColor',function(data,error){
    if(error){console.log(error);return;}
      yeelight.changeColor(data[0],data[1],data[2],data[3]);
  });
  socket.on('TurnOn',function(data,error){
    if(error){console.log(error);return;}
      yeelight.TurnOn();
  });
  socket.on('TurnOff',function(data,error){
    if(error){console.log(error);return;}
      yeelight.TurnOff();
  });
  socket.on('Party',function(data,error){
    if(error){console.log(error);return;}
      yeelight.randomColor();
  });

  socket.on('disconnect', function(){
    // console.log('user disconnected');
  });
  socket.on('error',function(error){
    if(error){console.log(error);return;}
  });
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/web/index.html');
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});
