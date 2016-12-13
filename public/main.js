//Ugh inline code
var socket = io();
window.addEventListener('keydown',this.keyDown,false);
//$('#userNameWrapper').addEventListener('submit', )
//userNameWrapper.preventDefault();


$('#messageInput').submit(function(){
  var msg = $('#m').val();
  console.log("submitting to server and adding message optimistically");
  $('#messages').append($('<li class="self">').text(msg));
  socket.emit('chat message', msg);
  $('#m').val('');
  return false;
});

//When receiving a chat message from another user, show it in the DOM
socket.on('chat message', function(msg){
  console.log("new message detected");
  $('#messages').append($('<li>').text(msg));

});
//When receiving a new user event, print the user ID to the console (remove later)
socket.on('newUser', function(id){
  console.log("new user detected:" + id);
  //$('#messages').append($('<li>').text(id));
});
//When a new userName is received, print it to the console
socket.on('newName', function(name, id){
  console.log("new username for user: " + id + " name: " + name);
  //$('#messages').append($('<li>').text(msg));
});

//Key listener to listen to enter event. Is now used to send the username and later to send messages as well
function keyDown(event) {
  if (event.key == "Enter"){
    socket.emit('setUserName', $('#usernameInput').val());
    $('#userNameWrapper').toggle();
    console.log("Username set: " + $('#usernameInput').val());
  }
  else {
    console.log("non enter key pressed");
  }
  /*
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (username) {
        sendMessage();
        socket.emit('stop typing');
        typing = false;
      } else {
        setUsername();
      }
    }
    */
 }