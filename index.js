/*
This code is adapted from the socket.io example: http://socket.io/get-started/chat/
TODO:
v Broadcast a message to connected users when someone connects or disconnects
V Add support for nicknames
V Don’t send the same message to the user that sent it himself. Instead, append the message directly as soon as he presses enter.
Add “{user} is typing” functionality
Show who’s online
Add private messaging
*/

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));
//When a new client connects
io.on('connection', function(socket){
  console.log('a user connected');

  socket.broadcast.emit('newUser', socket.id); 
  
  socket.on('setUserName', function(name){// Change to emit to all
    console.log("detected new username");
    socket.username = name;
    io.sockets.emit('newName', socket.id, socket.username); //Sends message to all sockets
  });

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    socket.broadcast.emit('chat message', msg);
  });

  socket.on('disconnect', function(){
    io.sockets.emit('userLeft', socket.username);
    console.log('user disconnected', socket.username);
  });
});

http.listen(3000, function(){
  console.log("You're listening to *:3000, listener supported radio");
});