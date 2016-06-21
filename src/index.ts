import { indexAll, indexOne, filter } from './indexOps';
import { IndexInfoDict } from './interfaces';
export { IndexInfo, IndexInfoDict, Dependents } from './interfaces';
// pkg-json-info-dict is only used for its PkgJSONInfoDict type definition
import { PkgJSONInfoDict } from 'pkg-json-info-dict/lib';

export interface Opts {
  pkgName?: string;
  recurse?: boolean;
}

/**
 * Given a PkgJSONInfoDict data structure, returns an IndexInfoDict data structure.
 * The returned IndexInfoDict can be truncated based on the given opts object.
 * opts.pkgName can be left null / undefined for no filtering. If a value is given,
 * then only the key pkgName will be present in resutling IndexInfoDict.
 * opts.recurse can be given (default false). This only has an effect with a given pkgName (i.e. no pkgName
 * means "everything including recurse").
 * If opts.recurse is true and pkgName is given then returned IndexInfoDict contains an entry for pkgName as
 * well as an entry for every pkg which depends on pkgName (i.e. pkgName dependents).
 *
 * @param  {PkgJSONInfoDict} pkgJSONInfoDict output of pkg-json-info-dict (or similar)
 * @param  {Opts}            opts            opts.pkgName, opts.recurse
 * @param  {IndexInfoDict}   cb              cb(err, result: IndexInfoDict)
 * @return {void}
 */
 export default function pkgDependents(pkgJSONInfoDict: PkgJSONInfoDict, opts: Opts, cb: (err, result: IndexInfoDict) => void): void {
   opts = opts || {};
   var pkgName = opts.pkgName;
   var recurse = opts.recurse || false;

  if (!pkgName) {
    cb(null, indexAll(pkgJSONInfoDict));
  } else if (recurse) {
    var resultRecurse = filter(indexAll(pkgJSONInfoDict), pkgName);
    cb(null, resultRecurse);
  } else {
    var result: IndexInfoDict = {};
    result[pkgName] = indexOne(pkgJSONInfoDict, pkgName);
    cb(null, result);
  }
 }
