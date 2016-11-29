var app = require('express')(); //Loads the express module, don't know why this needs the additional ()
var http = require('http').Server(app);

app.get('/', function(req, res){
	res.send('<h1>Hello Server</h1>');
});

http.listen(3000, function(){
	console.log("You're listening to *:3000, listener supported radio");
});
