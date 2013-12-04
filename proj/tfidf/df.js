var df = {};

var lazy = require('lazy');
var fs = require('fs');
var nimble = require('nimble');

var processed = 0;

var totes = 2012348;
var done = 0;
var lastDone = 0;
var keys = [];

var output = process.stdout;

setInterval(function () {
 var l = done - lastDone;
 var docssec = l/10;

 process.stderr.write(l/10 + " docs / sec; " + Math.floor((done/totes) * 100) + " %. " + "ETA is " + ((totes - done) / docssec)/60 + " minutes \n");

 lastDone = done;
}, 10000);


lazy(fs.createReadStream('termized.json')).lines.forEach(function (line) {
  line = JSON.parse(line);
  line[0].forEach(function (item) {
    if (df[item]) df[item] += 1;
    else {
      df[item] = 1;
      keys.push(item);
   }
  });

  done += 1;
}).on('pipe', function () {
   done = 0;
   totes = keys.length;

   process.stderr.write('writing to file\n');

   output.write("{");

   for (var kidx in keys) {
      var key = keys[kidx];
      output.write('"' + key + '":' + df[key] + ",\n");
      done += 1;
   }

   output.write('}');

});
