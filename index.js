var express = require('express');
var app = express();
var http = require('http').Server(app);

var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
  console.log('a user connected');

  socket.broadcast.emit('newUser', socket.id); //I cant find the result of this anywhere in the app
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    socket.broadcast.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log("You're listening to *:3000, listener supported radio");
});