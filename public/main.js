var socket = io();
var userName;
var myId;
var dictionary;
window.addEventListener('keydown',this.keyDown,false);

//Make it not be optimistic, wont work with highlighting common words
$('#messageInput').submit(function(){
  var msg = $('#m').val();
  if (msg !== ""){
    //console.log("submitting to server and adding message optimistically");
    //$('#messages').append($('<li class="self">').text(msg));
    socket.emit('chat message', msg);
    $('#m').val('');
    //highlighter();
  }
  return false;
});

socket.on('connect', function(){
  console.log("connection to server made");
  console.log(socket.io.engine.id);
  myId = socket.io.engine.id;
});

socket.on('initial dic', function(dic){
  console.log("Receiving initial dictionary");
  dictionary = dic;
  console.log(dictionary);
});

socket.on('update dic', function(dic){
  console.log("Receiving update to dictionary");
  dictionary = dic;
  console.log(dictionary);
});

//When receiving a chat message from another user, show it in the DOM
socket.on('chat message', function(msg, id){
  console.log("new message detected:" + msg);
  $('#messages').append($('<li class="'+ (id== myId? "self":"")+ '">').text(msg));
  highlighter();
});
//When receiving a new user event, print the user ID to the console (remove later)
socket.on('newUser', function(id){
  console.log("new user detected:" + id);
  //$('#messages').append($('<li>').text(id));
});
//When a new userName is received, print it to the console
socket.on('newName', function(id, name){
  console.log("new username for user: " + id + " name: " + name);
  if (id == myId)
  {
    console.log("a girl has a name");
    userName = name;
    $('#messages').append($('<li>').text("Welcome " + userName + ". Remember, anything you say can and will be used against you."));
  }
  else {  $('#messages').append($('<li>').text(name + " just joined the chatroom")); }
});

socket.on('userLeft', function(name){
  console.log("user disconnected" + name);
  $('#messages').append($('<li>').text(name + " has left the building"));
});

function highlighter()
{
  console.log("running highlighter");
  var lastMessage = document.getElementById('messages').lastChild;
  //You have to clean up the string here as well

  var text = lastMessage.innerHTML.split(' ').map(function(el) {
    console.log(el);
    console.log(dictionary);
    console.log(dictionary[el]);
        return '<span class="common-' + (dictionary[el] > 9? 10: dictionary[el]) + '">' + el + '</span>';
    }).join(' ');
  
  lastMessage.innerHTML = text;
}

//Key listener to listen to enter event. Is now used to send the username and later to send messages as well
function keyDown(event) {
  if (event.key == "Enter"){
    if(!userName)
    {
      socket.emit('setUserName', $('#usernameInput').val());
      $('#userNameWrapper').toggle();
      console.log("Sending username: " + $('#usernameInput').val());
    }
    else {
        //console.log("non enter key pressed");
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
}