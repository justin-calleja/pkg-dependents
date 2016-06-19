import { AbsPathPkgJSONDict, AbsPathPkgJSON, Dependents, IndexInfo, IndexInfoDict } from './interfaces';

export function indexOne(indexInputs: AbsPathPkgJSONDict, pkgName: string): IndexInfo {
  if (indexInputs[pkgName] === undefined) {
    return undefined;
  }

  var dependents: Dependents = {
    dependencyDependents: {},
    peerDependencyDependents: {},
    devDependencyDependents: {}
  };

  Object.keys(indexInputs).forEach(indexInputsKey => {
    var absPath = indexInputs[indexInputsKey].absPath;
    var pkgJSON = indexInputs[indexInputsKey].pkgJSON;

    if (pkgJSON.dependencies && pkgJSON.dependencies[pkgName])
      dependents.dependencyDependents[indexInputsKey] = { absPath, pkgJSON };
    if (pkgJSON.peerDependencies && pkgJSON.peerDependencies[pkgName])
      dependents.peerDependencyDependents[indexInputsKey] = { absPath, pkgJSON };
    if (pkgJSON.devDependencies && pkgJSON.devDependencies[pkgName])
      dependents.devDependencyDependents[indexInputsKey] = { absPath, pkgJSON };
  });

  return {
    absPath: indexInputs[pkgName].absPath,
    pkgJSON: indexInputs[pkgName].pkgJSON,
    dependents
  };
}

export function indexAll(indexInputs: AbsPathPkgJSONDict): IndexInfoDict {
  return Object.keys(indexInputs).reduce((acc: IndexInfoDict, indexInputsKey: string) => {
    acc[indexInputsKey] = indexOne(indexInputs, indexInputsKey);
    return acc;
  }, <IndexInfoDict>{});
}

function _filter(result: IndexInfoDict, indexInfos: IndexInfoDict, pkgName: string) {
  var dependents: Dependents = result[pkgName].dependents;
  var allDependentsKeys: string[] = Object.keys(dependents.dependencyDependents)
    .concat(Object.keys(dependents.peerDependencyDependents))
    .concat(Object.keys(dependents.devDependencyDependents));

  allDependentsKeys.forEach((key: string) => {
    result[key] = indexInfos[key];
    _filter(result, indexInfos, key);
  });
  return result;
}

/**
 * Filters indexInfos to only include info on pkgName and any of its dependents recursively.
 * i.e. returns given indexInfoDict or a subset of it (filtered by pkgName and its dependents).
 */
export function filter(indexInfos: IndexInfoDict, pkgName: string): IndexInfoDict {
  var pkgIndexInfo: IndexInfo = indexInfos[pkgName];
  var tmpResult: IndexInfoDict = {};
  tmpResult[pkgName] = pkgIndexInfo;
  if (pkgIndexInfo === undefined) {
    return tmpResult;
  } else {
    return _filter(tmpResult, indexInfos, pkgName)
  }
}
