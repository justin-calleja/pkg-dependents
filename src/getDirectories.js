var fs = require('fs');
var path = require('path');

module.exports = function getDirectories(absPath) {
  return fs.readdirSync(absPath).filter((file) => fs.statSync(path.join(absPath, file)).isDirectory());
}
