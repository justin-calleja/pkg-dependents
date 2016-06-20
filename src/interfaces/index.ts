export interface AbsPathPkgJSON {
  // the absolute path to the directory holding the package.json file
  absPath: string;
  // the parsed contents of a package.json file
  pkgJSON: PkgJSON;
}

export interface PkgJSON {
  name: string;
  version: string;
  dependencies?: { [el: string]: string };
  peerDependencies?: { [el: string]: string };
  devDependencies?: { [el: string]: string };
}

export interface IndexInfo extends AbsPathPkgJSON {
  dependents: Dependents;
}

export interface IndexInfoDict {
  [el: string]: IndexInfo;
}

export interface AbsPathDirs {
  absPath: string;
  dirs: string[];
}

// an Object whose keys are of type AbsPathPkgJSON
export interface AbsPathPkgJSONDict {
  [el: string]: AbsPathPkgJSON;
}

export interface Dependents {
  dependencyDependents: AbsPathPkgJSONDict;
  peerDependencyDependents: AbsPathPkgJSONDict;
  devDependencyDependents: AbsPathPkgJSONDict;
}

export interface Opts {
  // the paths in which to search for dependents
  paths?: string[];
  // whether or not to return dependents of the dependents (of the dependents etc…) in the result
  recurse?: boolean;
}
