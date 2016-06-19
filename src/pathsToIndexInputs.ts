import { readFileSync } from 'fs';
import { join } from 'path';
import getDirectories from './getDirectories';
import { AbsPathPkgJSON, AbsPathDirs, AbsPathPkgJSONDict } from './interfaces';

/**
 * Given an array of absolute paths, each path has its directories searched for a package.json
 * file. The result is an object. This object is keyed with the names of each package.json found.
 * The value for each key is an AbsPathPkgJSON.
 */
export default function pathsToIndexInputs(paths:string[]): AbsPathPkgJSONDict {
  var absPathsAndDirs: AbsPathDirs[] = paths.map(absPath => ({
    absPath,
    dirs: getDirectories(absPath)
  }));

  return absPathsAndDirs.reduce((acc: AbsPathPkgJSONDict, val: AbsPathDirs) => {
    val.dirs.forEach(dir => {
      var pkgJSONString = undefined;
      try {
        pkgJSONString = readFileSync(join(val.absPath, dir, 'package.json')).toString();
      } catch(e) {
        if (e.code !== 'ENOENT') throw e;
      }
      if (pkgJSONString !== undefined) {
        var pkgJSON = JSON.parse(pkgJSONString);
        acc[pkgJSON.name] = {
          absPath: join(val.absPath, dir),
          pkgJSON
        };
      }
    });
    return acc;
  }, <AbsPathPkgJSONDict>{});
}
