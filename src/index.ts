import pathsToIndexInputs from './pathsToIndexInputs';
import * as indexOps from './indexOps';

export interface Opts {
  // the paths in which to search for dependents
  paths: string[];
  // whether or not to return dependents of the dependents (of the dependents etc…) in the result
  recurse: boolean;
}

export default function pkgDependents(pkgName: string, opts: Opts, cb: (err: Error, result) => void) {
  var paths = opts.paths || [];
  var recurse = opts.recurse || false;

  var indexInputs = pathsToIndexInputs(paths);
  if (recurse) {
    var resultRecurse = indexOps.filter(indexOps.indexAll(indexInputs), pkgName);
    cb(null, resultRecurse);
  } else {
    var result = {};
    result[pkgName] = indexOps.indexOne(indexInputs, pkgName);
    cb(null, result);
  }
}
