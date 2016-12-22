/*
* This simple module allows you to create a lexicon that stores words and their occurrence
* It does this after it cleans the words from interpunction and weird symbols so 'this' and 'this?' are not counted
* as two different words
*/
var dictionary = function(){
  var self = this;
  lexicon = {};
  self.addWords = function(msg, senderId){
    console.log("index called with: " + msg);
    var cleanMsg = msg.replace(/[^\w\s]|_/g, "") //This nice little regex came from this post and was written bij John Kugelman http://stackoverflow.com/questions/4328500/how-can-i-strip-all-punctuation-from-a-string-in-javascript-using-regex
           .replace(/\s+/g, " ");
    var newWords = cleanMsg.split(" ");
    for (var i in newWords){
        if (!lexicon.hasOwnProperty(newWords[i])){
          lexicon[newWords[i]] = 0;
        }
        lexicon[newWords[i]] ++;
    }
  };
  self.get = function(){
    return lexicon;
  };
};
module.exports = dictionary;