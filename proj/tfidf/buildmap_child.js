var fs = require('fs')
var natural = require('natural');
var redis = require('redis').createClient();

redis.on('error', function (er) {
process.stderr.write(er);
});

process.on('message', function (line) {
  line = JSON.parse(line);

  var terms = [];
  line[0].forEach(function (item) {
    terms.push(item.term);
  });
  
  var bigrams = natural.NGrams.bigrams(terms);

  bigrams.forEach(function (t) {
    t = t.join(',');
    line[1].forEach(function (tag) {
      redis.hincrby(t, tag, 1);
    });
  });

  process.send('done');
});
