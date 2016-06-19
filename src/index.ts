import pathsToIndexInputs from './pathsToIndexInputs';
import { indexAll, indexOne, filter } from './indexOps';
import { IndexInfoDict } from './interfaces';

export interface Opts {
  // the paths in which to search for dependents
  paths: string[];
  // whether or not to return dependents of the dependents (of the dependents etc…) in the result
  recurse: boolean;
}

export default function pkgDependents(pkgName: string, opts: Opts, cb: (err: Error, result: IndexInfoDict) => void) {
  var paths = opts.paths || [];
  var recurse = opts.recurse || false;

  var indexInputs = pathsToIndexInputs(paths);
  if (!pkgName) {
    cb(null, indexAll(indexInputs));
  } else if (recurse) {
    var resultRecurse = filter(indexAll(indexInputs), pkgName);
    cb(null, resultRecurse);
  } else {
    var result: IndexInfoDict = {};
    result[pkgName] = indexOne(indexInputs, pkgName);
    cb(null, result);
  }
}
