/*
This code is adapted from the socket.io example: http://socket.io/get-started/chat/
TODO:
Kicking users?
Highlight server messages a different way, maybe outline right as well?
Call this app: Tragedy of the commons (also words like the and it should be not included)
Add autoscroll (http://stackoverflow.com/questions/23612704/jquery-auto-scroll-where-the-current-li-is)
lowercase all entries into the dictionary
Styling: Add filt/felt? feeling to the splash page a la: http://overapi.com/nodejs
*/

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var dictionary = require("./dictionary.js");  //My own dictionary module
var myDictionary = new dictionary();          //Make an instance of this module

app.use(express.static(__dirname + '/public'));
//When a new client connects
io.on('connection', function(socket){
  //console.log('a user connected');
  socket.emit('initial dic', myDictionary.get()); //On connect, pass a client the current dictionary

  socket.broadcast.emit('newUser', socket.id); 
  
  socket.on('setUserName', function(name){
    socket.username = name;
    io.sockets.emit('newName', socket.id, socket.username); //Sends message to all sockets
  }); 

  socket.on('chat message', function(msg){
    //console.log('message: ' + msg);
    myDictionary.addWords(msg);
    io.sockets.emit('update dic', myDictionary.get());
    //console.log("dictionary now contains: ");
    io.sockets.emit('chat message', msg, socket.id);
  });

  socket.on('disconnect', function(){
    io.sockets.emit('userLeft', socket.username);
    //console.log('user disconnected', socket.username);
  });
});

http.listen(3000, function(){
  console.log("You're listening to *:3000, listener supported radio");
});