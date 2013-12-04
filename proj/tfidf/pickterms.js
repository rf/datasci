var df = require('./df.json');
var fs = require('fs')
var lazy = require('lazy')

var output = fs.createWriteStream('pickedterms.json');

lazy(fs.createReadStream('termized.json')).lines.forEach(function (line) {
  line = JSON.parse(line);

  var terms = {};

  line[0].forEach(function (item) {
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

  output.write(JSON.stringify([
    termarray.slice(0, 10),
    line[1]
  ]) + "\n");
});
