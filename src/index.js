var pathsToIndexInputs = require('./pathsToIndexInputs');
var indexOps = require('./indexOps');

function pkgDependents(pkgName, opts, onDoneCb) {
  var paths = opts.paths || [];
  var recurse = opts.recurse || false;

  var indexInputs = pathsToIndexInputs(paths);
  if (recurse) {
    var resultRecurse = indexOps.filter(indexOps.indexAll(indexInputs), pkgName);
    onDoneCb(null, resultRecurse);
  } else {
    var result = {};
    result[pkgName] = indexOps.indexOne(indexInputs, pkgName);
    onDoneCb(null, result);
  }
}

module.exports = pkgDependents;
