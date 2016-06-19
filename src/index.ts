import pathsToIndexInputs from './pathsToIndexInputs';
import { indexAll, indexOne, filter } from './indexOps';
import { IndexInfoDict } from './interfaces';

export interface Opts {
  // the paths in which to search for dependents
  paths: string[];
  // whether or not to return dependents of the dependents (of the dependents etc…) in the result
  recurse: boolean;
}

/**
 * Given an array of directory paths housing Node packages (projects), each package's package.json is read
 * and a data-structure (IndexInfoDict) is returned with an entry for each package and information
 * about each package and its dependents (packages which depend on it).
 *
 * @param  {string}        pkgName The package in which you're interested in (limits scope of contents in IndexInfoDict)
 * @param  {Opts}          opts    Contain paths: string[] of paths in which to look for Node packages. Also contains 'recurse'
 *                                 option which will, apart from data about pkgName, will also include data about pkgName's
 *                                 dependents (and their dependents etc…) in the resulting IndexInfoDict (as long as these
 *                                 dependent packages are also in given opts.paths)
 * @param  {IndexInfoDict} cb      The callback which will be given the result or error.
 * @return {void}                  No return value (use cb)
 */
export default function pkgDependents(pkgName: string, opts: Opts, cb: (err: Error, result: IndexInfoDict) => void): void {
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
