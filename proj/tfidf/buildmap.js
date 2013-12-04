var fs = require('fs')
var natural = require('natural');
var lazy = require('lazy')
var redis = require('redis').createClient();

redis.on('error', function (er) {
   process.stderr.write(er);
});

var map = {};
var keys = [];

var totes = 2012348;
var done = 0;
var lastDone = 0;
var keys = [];

var output = process.stdout;

function reportprogress () {
 var l = done - lastDone;
 var docssec = l/10;

 process.stderr.write(l/10 + " docs / sec; " + Math.floor((done/totes) * 100) + " %. " + "ETA is " + ((totes - done) / docssec)/60 + " minutes \n");

 lastDone = done;
}

setInterval(function () {
   reportprogress();
}, 10000);

var children = [];
var fork = require('child_process').fork;
var numkids = 32;

for (var i = 0; i < numkids; i++) {
  children.push(fork(__dirname + '/buildmap_child.js'));
}

for (var i = 0; i < numkids; i++) 
   children[i].on('message', function (msg) { done += 1; });

var curr = 0;

lazy(fs.createReadStream('pickedterms.json')).lines.forEach(function (line) {
  children[curr].send(String(line));
  curr+=1;

  if (curr == numkids) curr = 0;

}).on('pipe', function () {
/*
   process.stderr.write('writing to file\n');

   done = 0;
   totes = keys.length;

   output.write("{");

   for (var kidx in keys) {
      var key = keys[kidx];
      output.write('"' + key + '":' + df[key] + ",");
      done += 1;
      if (done != keys.length) output.write(",\n");

      if (done % 1000 == 0) reportprogress();
   }

   output.write('}');
   */

});
