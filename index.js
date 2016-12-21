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
*/

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var dictionary = {
};

app.use(express.static(__dirname + '/public'));
//When a new client connects
io.on('connection', function(socket){
  //console.log('a user connected');
  socket.emit('initial dic', dictionary); //On connect, pass a client the current dictionary

  socket.broadcast.emit('newUser', socket.id); 
  
  socket.on('setUserName', function(name){// Change to emit to all
    //console.log("detected new username");
    socket.username = name;
    io.sockets.emit('newName', socket.id, socket.username); //Sends message to all sockets
  }); 

  socket.on('chat message', function(msg){
    //console.log('message: ' + msg);
    index(msg, socket.id);
  });

  socket.on('disconnect', function(){
    io.sockets.emit('userLeft', socket.username);
    //console.log('user disconnected', socket.username);
  });
});
//TODO: move to own file/ class
//PAttern: constructor class library with add function and get set
//Make sure the array is sorted to have most common at the top so the compare is more effective
function index(msg, senderId){
  console.log("index called with: " + msg);
  var cleanMsg = msg.replace(/[^\w\s]|_/g, "") //This nice little regex came from this post and was written bij John Kugelman http://stackoverflow.com/questions/4328500/how-can-i-strip-all-punctuation-from-a-string-in-javascript-using-regex
         .replace(/\s+/g, " ");
  var newWords = cleanMsg.split(" ");
  for (i in newWords){
      if (!dictionary.hasOwnProperty(newWords[i])){
        dictionary[newWords[i]] = 0;
      }
      dictionary[newWords[i]] ++;
  }
  io.sockets.emit('update dic', dictionary);
  //console.log("dictionary now contains: ");
  //console.log(dictionary);
  io.sockets.emit('chat message', msg, senderId);
}

http.listen(3000, function(){
  console.log("You're listening to *:3000, listener supported radio");
});