var stuff = require('./stuff');
var assert = require('assert');
var fs = require('fs');

stuff.go('./posts.json', function (map, df) {
  fs.writeFileSync('map', JSON.stringify(map));
  fs.writeFileSync('df', JSON.stringify(df));
});
