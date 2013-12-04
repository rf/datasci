var df = {};
var map = {};

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

function one (input, tags) {
  var terms = {};

  input = termize(input);

  // take each term once
  input.forEach(function (term) {
    terms[term] = true;
    if (df[term]) df[term] += 1;
    else df[term] = 1;
  });

  for (var term in terms) {
    map[term] = map[term] || {};
    tags.forEach(function (tag) {
      if (map[term][tag]) map[term][tag] += 1;
      else map[term][tag] = 1;
    });
  }
}

var totes = 2012348;
var done = 0;
var lastDone = 0;

var lastpercent = -1;

function go (filename, callback) {
  var output = fs.createWriteStream('termized.json');

  setInterval(function () {
    var l = done - lastDone;
    var docssec = l/10;

    console.log(l/10 + " docs / sec; " + Math.floor((done/totes) * 100) + " %. " + "ETA is " + ((totes - done) / docssec)/60 + " minutes ");

    lastDone = done;
  }, 10000);

  lazy(fs.createReadStream(filename)).lines.forEach(function (line) {
    line = JSON.parse(line);
    //one(line.Title + ' ' + line.Body, line.Tags);
    done += 1;

    var percent = ((done / totes) * 100);

    //console.log(percent);
    
    output.write(JSON.stringify([
      termize(line.Title + ' ' + line.Body), 
      line.Tags
    ]) + "\n");

  }).on('pipe', function () {
    callback(map, df);
  });
}

function tag (input) {
  var text = termize(input.Title + ' ' + input.Body);
}

exports.removeStopWords = removeStopWords;
exports.go = go;
exports.termize = termize;
exports.tag = tag;
