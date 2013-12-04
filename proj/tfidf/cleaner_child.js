var natural = require('natural');
var lazy = require('lazy');
var fs = require('fs');

var stopwordsArray = require('./stopwords');
var stopwords = {};
for (var i in stopwordsArray) {
  stopwords[stopwordsArray[i]] = true;
}

function removeStopWords (input) {
  return input.reduce(function (memo, item) {
    if (!stopwords[item]) memo.push(item);
    return memo;
  }, []);
}

function termize (input) {
  return removeStopWords(natural.PorterStemmer.tokenizeAndStem(input));
}

process.on('message', function (msg) {
  msg = JSON.parse(msg);
  process.send(JSON.stringify([
    termize(msg.Title + ' ' + msg.Body),
    msg.Tags
  ]) + "\n");
});
