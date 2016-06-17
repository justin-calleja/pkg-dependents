var fs = require('fs');
var path = require('path');
var getDirectories = require('./getDirectories');

/**
 * @typedef IndexInputElement
 * @type Object
 * @property {string} absPath the absolute path to the directory holding the package.json file
 * @property {Object} pkgJSON the parsed contents of a package.json file
 */

/**
 * Given an array of absolute paths, each path has its directories searched for a package.json
 * file. The result is an object. This object is keyed with the names of each package.json found.
 * The value for each key is an IndexInputElement i.e. it's another object with absPath (string)
 * and pkgJSON (object) keys.
 *
 * @param {Array.<string>} paths the absolute paths to directories housing node projects
 * @returns {Object.<IndexInputElement>}
 */
module.exports = function pathsToIndexInputs(paths) {
  var absPathsAndDirs = paths.map(absPath => ({
    absPath,
    dirs: getDirectories(absPath)
  }));

  return absPathsAndDirs.reduce((acc, val) => {
    val.dirs.forEach(dir => {
      var pkgJSONString = undefined;
      try {
        pkgJSONString = fs.readFileSync(path.join(val.absPath, dir, 'package.json')).toString();
      } catch(e) {
        if (e.code !== 'ENOENT') throw e;
      }
      if (pkgJSONString !== undefined) {
        var pkgJSON = JSON.parse(pkgJSONString);
        acc[pkgJSON.name] = {
          absPath: path.join(val.absPath, dir),
          pkgJSON: pkgJSON
        };
      }
    });
    return acc;
  }, {});
}
