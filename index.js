/*
This code is adapted from the socket.io example: http://socket.io/get-started/chat/
TODO:
Broadcast a message to connected users when someone connects or disconnects
Add support for nicknames
Don’t send the same message to the user that sent it himself. Instead, append the message directly as soon as he presses enter.
Add “{user} is typing” functionality
Show who’s online
Add private messaging
*/

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
  console.log('a user connected');

  socket.broadcast.emit('newUser', socket.id); //Change this later to emit the username also add message when someone leaves
  
  socket.on('setUserName', function(name){
    console.log("detected new username");
    socket.username = name;
    socket.broadcast.emit('newName', socket.id, socket.username); 
  });

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