import { PkgJSONInfo, PkgJSONInfoDict } from 'pkg-json-info-dict/lib';

import * as _dependentsOps from './dependentsOps';
export var dependentsOps = _dependentsOps;

import { D_DEPENDENT, P_DEPENDENT, DD_DEPENDENT } from './constants';
export const constants = {
  D_DEPENDENT,
  P_DEPENDENT,
  DD_DEPENDENT
};

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

export function countDependencyDependents(dependents: Dependents): number {
  return Object.keys(dependents.dependencyDependents).length;
}
export function countPeerDependencyDependents(dependents: Dependents): number {
  return Object.keys(dependents.peerDependencyDependents).length;
}
export function countDevDependencyDependents(dependents: Dependents): number {
  return Object.keys(dependents.devDependencyDependents).length;
}
export function countDependents(dependents: Dependents): number {
  return countDependencyDependents(dependents)
    + countPeerDependencyDependents(dependents)
    + countDevDependencyDependents(dependents);
}
