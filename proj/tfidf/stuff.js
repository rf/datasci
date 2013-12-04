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

var children = [];
var fork = require('child_process').fork;

for (var i = 0; i < 32; i++) {
  children.push(fork(__dirname + '/cleaner_child.js'));
}

var curr_child = 0;

var totes = 2012348;
var done = 0;
var lastDone = 0;

var lastpercent = -1;

function go (filename, callback) {
  var output = fs.createWriteStream('termized.json');
//  var output = process.stdout;

  for (var i = 0; i < 32; i++) {
    children[i].on('message', function (msg) {
      output.write(msg);
    });
  }

  setInterval(function () {
    var l = done - lastDone;
    var docssec = l/10;

    process.stderr.write(l/10 + " docs / sec; " + Math.floor((done/totes) * 100) + " %. " + "ETA is " + ((totes - done) / docssec)/60 + " minutes \n");

    lastDone = done;
  }, 10000);

  lazy(fs.createReadStream(filename)).lines.forEach(function (line) {
  /*  
    line = JSON.parse(line);
    //one(line.Title + ' ' + line.Body, line.Tags);
    done += 1;

    var percent = ((done / totes) * 100);

    output.write(JSON.stringify([
      termize(line.Title + ' ' + line.Body), 
      line.Tags
    ]) + "\n");
    */

    children[curr_child].send(line);
    curr_child++;
    if (curr_child == 32) curr_child = 0;

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
