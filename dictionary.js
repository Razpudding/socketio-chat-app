/*
* This simple module allows you to create a lexicon that stores words and their occurrence
* It does this after it cleans the words from interpunction and weird symbols so 'this' and 'this?' are not counted
* as two different words
*/
var dictionary = function(){
  lexicon = {};
  this.addWords = function(msg, senderId){
    var cleanMsg = msg.replace(/[^\w\s]|_/g, "") //This nice little regex came from this post and was written bij John Kugelman http://stackoverflow.com/questions/4328500/how-can-i-strip-all-punctuation-from-a-string-in-javascript-using-regex
           .replace(/\s+/g, " ");
    var newWords = cleanMsg.split(" ");
    newWords.forEach( function(word){
     if (!lexicon.hasOwnProperty(word)){
          lexicon[word] = 0;
        }
        lexicon[word] ++;
    });
  };
  this.get = function(){
    return lexicon;
  };
};
module.exports = dictionary;