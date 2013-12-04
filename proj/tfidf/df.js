var df = {};

var lazy = require('lazy');
var fs = require('fs');

lazy(fs.createReadStream('termized.json')).lines.forEach(function (line) {
  line = JSON.parse(line);
  line[0].forEach(function (item) {
    if (df[item]) df[item] += 1;
    else df[item] = 1;
  });
}).on('pipe', function () {
  fs.writeFileSync('df.json', JSON.stringify(df));
});
