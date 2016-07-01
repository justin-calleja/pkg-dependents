import { Dependents } from './index';
import { constants as PJIDConstants, PkgJSONInfo } from 'pkg-json-info-dict';
import { D_DEPENDENT, P_DEPENDENT, DD_DEPENDENT } from './constants';

export interface VersionOpts {
  dependents: Dependents,
  dependentType: string;
  dependentName: string;
}

export interface VersionRangeOpts extends VersionOpts {
  dependencyType: string;
  pkgName: string;
}

export function dependentTypeToDependencyType(dependentType: string) {
  if (dependentType === D_DEPENDENT) {
    return PJIDConstants.DEPENDENCIES;
  } else if (dependentType === P_DEPENDENT){
    return PJIDConstants.PEER_DEPENDENCIES;
  } else if (dependentType === DD_DEPENDENT){
    return PJIDConstants.DEV_DEPENDENCIES;
  }
  return null;
}

export function version(vo: VersionOpts): string {
  return vo.dependents[vo.dependentType][vo.dependentName].pkgJSON.version;
}

export function versionRange(vro: VersionRangeOpts): string {
  return vro.dependents[vro.dependentType][vro.dependentName].pkgJSON[vro.dependencyType][vro.pkgName];
}

// ofDependentType: D_DEPENDENT | P_DEPENDENT | DD_DEPENDENT
// ofDependencyType: PJIDConstants.DEPENDENCIES | PJIDConstants.PEER_DEPENDENCIES | PJIDConstants.DEV_DEPENDENCIES
export function reduceDependents<T>(dependents: Dependents, cb: (acc: T, dependentName: string, ofDependentType: string, ofDependencyType: string) => T, initialValue: T): T {
  var result = Object.keys(dependents.dependencyDependents || {}).reduce((prevVal, currVal) => {
    return cb(prevVal, currVal, D_DEPENDENT, PJIDConstants.DEPENDENCIES)
  }, initialValue);
  result = Object.keys(dependents.peerDependencyDependents || {}).reduce((prevVal, currVal) => {
    return cb(prevVal, currVal, P_DEPENDENT, PJIDConstants.PEER_DEPENDENCIES)
  }, initialValue);
  result = Object.keys(dependents.devDependencyDependents || {}).reduce((prevVal, currVal) => {
    return cb(prevVal, currVal, DD_DEPENDENT, PJIDConstants.DEV_DEPENDENCIES)
  }, initialValue);

  return result;
}

export function forEachDependent(dependents: Dependents, cb: (dependent: PkgJSONInfo, dependentType: string) => void) {
  Object.keys(dependents.dependencyDependents).forEach(dependentName => {
    cb(dependents.dependencyDependents[dependentName], D_DEPENDENT);
  });
  Object.keys(dependents.peerDependencyDependents).forEach(dependentName => {
    cb(dependents.peerDependencyDependents[dependentName], P_DEPENDENT);
  });
  Object.keys(dependents.devDependencyDependents).forEach(dependentName => {
    cb(dependents.devDependencyDependents[dependentName], DD_DEPENDENT);
  });
}
