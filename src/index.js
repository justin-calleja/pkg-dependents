var pathsToIndexInputs = require('./pathsToIndexInputs');
var indexOps = require('./indexOps');

function pkgDependents(pkgName, opts, onDoneCb) {
  var paths = opts.paths || [];
  var recurse = opts.recurse || false;

  var indexInputs = pathsToIndexInputs(paths);
  if (recurse) {
    // TODO:
  } else {
    var res = {};
    res[pkgName] = indexOps.indexOne(indexInputs, pkgName);
    onDoneCb(null, res);
  }

}

module.exports = pkgDependents;
