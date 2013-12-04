var fs = require('fs')
var natural = require('natural');
var lazy = require('lazy')

var async = require('async');

var df = require('./df.json');

var redis = require('redis').createClient();

function termize (input) {
  return removeStopWords(natural.PorterStemmer.tokenizeAndStem(input));
}

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


lazy(fs.createReadStream('testdata.json')).lines.forEach(function (line) {
  line = JSON.parse(line);
  
  var termsraw = termize(line[0] + ' ' + line[1]);
  var terms = {};

  termsraw.forEach(function (item) {
    if (terms[item]) terms[item] += 1;
    else terms[item] = 1;
  });

  var termarray = [];

  for (var term in terms) {
    termarray.push({
      tfidf: terms[term] / df[term],
      term: term
    });
  }

  termarray.sort(function (a, b) {
    return b.tfidf - a.tfidf;
  });

  termarray = termarray.slice(0, 10);

  var onlyterms = [];

  for (var i in termarray)
    onlyterms.push(termarray[i].term);

  var trigrams = natural.NGrams.trigrams(onlyterms);

  trigrams = trigrams.concat(natural.NGrams.bigrams(onlyterms));

  var tags = [];

  //console.log(trigrams);
  //

  async.each(trigrams, function (item, done) {
   var full = item.join(',');
    var score = item.reduce(function (memo, item) {
      memo += terms[term] / df[term];
      return memo;
    }, 0);

    redis.hgetall(full, function (err, results) {
       for (var t in results) {
         tags.push({
           tag: t,
           score: score * results[t]
         });
       }

       done();
    });
  
  }, function () {

     tags = tags.reduce(function (memo, data) {
       if (memo[data.tag]) memo[data.tag] += data.score;
       else memo[data.tag] = data.score;
       return memo;
     }, {});

     bettertags = [];

     for (var i in tags) {
       bettertags.push({
         tag: i,
         score: tags[i]
       });
     }

     var sorted = bettertags.sort(function (a, b) {
       return b.score - a.score;
     });

     if (sorted.length > 0) {
       console.log(sorted.slice(0, 10).reduce(function (memo, item) { return memo + ' ' + item.tag; }, '') + "    actual: " + line[2]);
     }

     redis.end();
   });
});
