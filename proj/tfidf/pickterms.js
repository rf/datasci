var df = require('./df.json');
var fs = require('fs')
var lazy = require('lazy')

//var output = fs.createWriteStream('pickedterms.json');
var output = process.stdout;

var processed = 0;

var totes = 2012348;
var done = 0;
var lastDone = 0;

setInterval(function () {
 var l = done - lastDone;
 var docssec = l/10;

 process.stderr.write(l/10 + " docs / sec; " + Math.floor((done/totes) * 100) + " %. " + "ETA is " + ((totes - done) / docssec)/60 + " minutes \n");

 lastDone = done;
}, 10000);


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

  done += 1;

  output.write(JSON.stringify([
    termarray.slice(0, 10),
    line[1]
  ]) + "\n");
});
