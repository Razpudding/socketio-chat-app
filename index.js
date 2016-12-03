// TODO: Fix external CSS, apparently loading it with the normal local method wont work
// As the file needs to be served by the server. This shows how to do just that:
// http://stackoverflow.com/questions/12134554/node-js-external-js-and-css-files-just-using-node-js-not-express?lq=1

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.broadcast.emit('hi'); //I cant find the result of this anywhere in the app

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
	console.log("You're listening to *:3000, listener supported radio");
});

