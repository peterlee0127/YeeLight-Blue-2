var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var yeelight = require('./ble.js');
// require('events').EventEmitter.prototype._maxListeners = 200;
app.setMaxListeners(0);
io.sockets.setMaxListeners(0);

app.use(express.static(__dirname, '/web'));

var numberOfUsersOnline = 0;
var connectedYeelights = 0;

exports.numberOfYeelightsChanges = function(numberOfYeelights){
  connectedYeelights=numberOfYeelights;
  io.emit('numberOfYeelights',numberOfYeelights);
};

function disConnect(){
  setTimeout(function(){
    if(numberOfUsersOnline===0){
      setTimeout(function(){
        if(numberOfUsersOnline===0){
          yeelight.disConnectAll();
          console.log('no user online');
        }
      }, 1000);
    }
  }, 3000);
}

io.on('connection', function(socket){
  // console.log('a user connected');
  numberOfUsersOnline++;
  if(numberOfUsersOnline>0){
    setTimeout(function(){
      yeelight.startDiscover();
    }, 1000);
  }
  socket.on('disconnect', function(){
      numberOfUsersOnline--;
      if(numberOfUsersOnline===0){
        disConnect();
      }
  });
  io.emit('numberOfYeelights',connectedYeelights);

  socket.on('error',function(error){
    if(error){console.log(error);}
  });
  socket.on('changeColor',function(data,error){
    if(error){console.log(error);}
      yeelight.changeColor(data[0],data[1],data[2],data[3]);
  });
  socket.on('TurnOn',function(data,error){
    if(error){console.log(error);}
      yeelight.TurnOn();
  });
  socket.on('TurnOff',function(data,error){
    if(error){console.log(error);}
      yeelight.TurnOff();
  });
  socket.on('Party',function(data,error){
    if(error){console.log(error);}
      yeelight.randomColor();
  });

});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/web/index.html');
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});
