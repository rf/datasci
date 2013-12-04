var fs = require('fs')
var natural = require('natural');
var lazy = require('lazy')

var map = {};

lazy(fs.createReadStream('pickedterms.json')).lines.forEach(function (line) {
  line = JSON.parse(line);

  var terms = [];
  line[0].forEach(function (item) {
    terms.push(item.term);
  });
  
  var trigrams = natural.NGrams.trigrams(terms);

  trigrams.forEach(function (t) {
    t = t.join(',');
    map[t] = map[t] || {};
    line[1].forEach(function (tag) {
      if (map[t][tag]) map[t][tag] += 1;
      else map[t][tag] = 1;
    });
  });
}).on('pipe', function () {
  fs.writeFileSync('map.json', JSON.stringify(map));
});
