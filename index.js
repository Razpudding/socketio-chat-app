/*
This code is adapted from the socket.io example: http://socket.io/get-started/chat/
TODO:
v Broadcast a message to connected users when someone connects or disconnects
V Add support for nicknames
V Don’t send the same message to the user that sent it himself. Instead, append the message directly as soon as he presses enter.
Add private messaging
V Keep a record of all the words used, make common words appear smaller or not at all to inspire original language
Show who’s online
Kicking users?
Highlight server messages a different way, maybe outline right as well?
Call this app: Tragedy of the commons (also words like the and it should be not included)
Add autoscroll
lowercase all entries into the dictionary
*/

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//Modelled after: http://kevgriffin.com/node-js-using-require-to-load-your-own-files/
var dictionary = require("./dictionary.js");  //My own dictionary module
var myDictionary = new dictionary();          //Make an instance of this module

app.use(express.static(__dirname + '/public'));
//When a new client connects
io.on('connection', function(socket){
  //console.log('a user connected');
  socket.emit('initial dic', myDictionary.get()); //On connect, pass a client the current dictionary

  socket.broadcast.emit('newUser', socket.id); 
  
  socket.on('setUserName', function(name){// Change to emit to all
    //console.log("detected new username");
    socket.username = name;
    io.sockets.emit('newName', socket.id, socket.username); //Sends message to all sockets
  }); 

  socket.on('chat message', function(msg){
    //console.log('message: ' + msg);
    myDictionary.addWords(msg);
    io.sockets.emit('update dic', myDictionary.get());
    //console.log("dictionary now contains: ");
    //console.log(dictionary);
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