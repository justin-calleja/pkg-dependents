import { PkgJSONInfo, PkgJSONInfoDict } from 'pkg-json-info-dict/lib';

export interface IndexInfo extends PkgJSONInfo {
  dependents: Dependents;
}

export interface IndexInfoDict {
  [el: string]: IndexInfo;
}

export interface Dependents {
  dependencyDependents: PkgJSONInfoDict;
  peerDependencyDependents: PkgJSONInfoDict;
  devDependencyDependents: PkgJSONInfoDict;
}
