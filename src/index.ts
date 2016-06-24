import { PkgJSONInfo, PkgJSONInfoDict } from 'pkg-json-info-dict/lib';

export interface DependentsDict {
  // key is a package name
  [el: string]: Dependents;
}
export interface Dependents {
  dependencyDependents: PkgJSONInfoDict;
  peerDependencyDependents: PkgJSONInfoDict;
  devDependencyDependents: PkgJSONInfoDict;
}

export function dependentsOf(pkgName: string, pkgJSONInfoDict: PkgJSONInfoDict): Dependents {
  if (!pkgName) {
    throw new Error('Cannot find dependensOf without a given pkgName');
  }
  if (pkgJSONInfoDict[pkgName] === undefined) {
    return undefined;
  }

  var dependents: Dependents = {
    dependencyDependents: {},
    peerDependencyDependents: {},
    devDependencyDependents: {}
  };

  Object.keys(pkgJSONInfoDict).forEach((key: string) => {
    var absPath = pkgJSONInfoDict[key].absPath;
    var pkgJSON = pkgJSONInfoDict[key].pkgJSON;

    if (pkgJSON.dependencies && pkgJSON.dependencies[pkgName])
      dependents.dependencyDependents[key] = { absPath, pkgJSON };
    if (pkgJSON.peerDependencies && pkgJSON.peerDependencies[pkgName])
      dependents.peerDependencyDependents[key] = { absPath, pkgJSON };
    if (pkgJSON.devDependencies && pkgJSON.devDependencies[pkgName])
      dependents.devDependencyDependents[key] = { absPath, pkgJSON };
  });

  return dependents;
}

export function dependentsOfDict(pkgName: string, pkgJSONInfoDict: PkgJSONInfoDict): DependentsDict {
  var dependents = dependentsOf(pkgName, pkgJSONInfoDict);

  var result: DependentsDict = {};
  result[pkgName] = dependents;
  return result;
}

export function allDependentsOf(pkgJSONInfoDict: PkgJSONInfoDict): DependentsDict {
  return Object.keys(pkgJSONInfoDict).reduce((acc, key: string) => {
    acc[key] = dependentsOf(key, pkgJSONInfoDict);
    return acc;
  }, <DependentsDict>{});
}

/**
 * Filters dependentsDict entries to only include pkgName and any of its dependents recursively
 * (i.e. if pkgName has a dependent X, then X's dependents are left in the given dependentsDict etc...).
 * Any dependents in dependentsDict which is not keyed by pkgName or any of it's dependents recursively is
 * removed from dependentsDict (note: the operation does NOT mutate dependentsDict)
 */
export function filterDependentsDict(pkgName: string, dependentsDict: DependentsDict): DependentsDict {
  var dependents: Dependents = dependentsDict[pkgName];
  var tmpResult: DependentsDict = {};
  tmpResult[pkgName] = dependents;
  if (dependents === undefined) {
    return tmpResult;
  } else {
    return _filterDependentsDict(pkgName, tmpResult, dependentsDict)
  }
}

function _filterDependentsDict(pkgName: string, result: DependentsDict, dependentsDict: DependentsDict) {
  var dependents: Dependents = result[pkgName];
  var allDependentsKeys: string[] = Object.keys(dependents.dependencyDependents)
    .concat(Object.keys(dependents.peerDependencyDependents))
    .concat(Object.keys(dependents.devDependencyDependents));

  allDependentsKeys.forEach((key: string) => {
    result[key] = dependentsDict[key];
    _filterDependentsDict(key, result, dependentsDict);
  });
  return result;
}

/**
 * Removes all (dep / devDep / peerDep) dependents which are not on pkgName in given dependents
 *
 * @param  {string}     pkgName
 * @param  {Dependents} dependents
 * @return {Dependents}
 */
export function filterDependents(pkgName: string, dependents: Dependents): Dependents {
  if (!pkgName) {
    return dependents;
  }
  if (!dependents) {
    return undefined;
  }

  var result = <Dependents>{};
  result.dependencyDependents = _filterDependents(pkgName, dependents.dependencyDependents || {});
  result.peerDependencyDependents = _filterDependents(pkgName, dependents.peerDependencyDependents || {});
  result.devDependencyDependents = _filterDependents(pkgName, dependents.devDependencyDependents || {});

  return result;
}

function _filterDependents(pkgName: string, pkgJSONInfoDict: PkgJSONInfoDict): PkgJSONInfoDict {
  return Object.keys(pkgJSONInfoDict).reduce((acc, key) => {
    if (key === pkgName) {
      acc[key] = pkgJSONInfoDict[key];
    }
    return acc;
  }, <PkgJSONInfoDict>{});
}
