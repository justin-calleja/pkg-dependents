/**
 * pkg-dependents needs to search. To search efficiently and index is built.
 * This module is used to store all index related operations.
 * @module indexOps
 * @see module:pathsToIndexInputs for the main data-structure used here (Object.<IndexInputElement>)
 */

/**
 * @typedef Dependents
 * @type Object
 * @property {Array.<IndexInputElement>} dependencyDependents an array of IndexInputElement(s) (absPath + pkgJSON) of all packages with a dependency on the indexed package
 * @property {Array.<IndexInputElement>} peerDependencyDependents an array of IndexInputElement(s) (absPath + pkgJSON) of all packages with a peerDependency on the indexed package
 * @property {Array.<IndexInputElement>} devDependencyDependents an array of IndexInputElement(s) (absPath + pkgJSON) of all packages with a devDependency on the indexed package
 */

/**
 * @typedef IndexInfo
 * @type Object
 * @property {string} absPath the absolute path to the directory holding the package.json file
 * @property {Object} pkgJSON the parsed contents of a package.json file
 * @property {Dependents} dependents the dependents of this package
 */

/**
 * For a given pkgName and indexInputs in which to search in, finds all packages
 * which have pkgName as a dependency/peerDependency/devDependency and returns
 * them in their correct category.
 * @param {Object.<IndexInputElement>} indexInputs The data-structure containing pkgJSONs to search
 * @param {string} pkgName The package name whose dependents are being searched for
 * @returns {IndexInfo}
 */
function indexOne(indexInputs, pkgName) {
  var dependents = {
    dependencyDependents: [],
    peerDependencyDependents: [],
    devDependencyDependents: []
  }
  Object.keys(indexInputs).forEach(indexInputsKey => {
    var absPath = indexInputs[indexInputsKey].absPath;
    var pkgJSON = indexInputs[indexInputsKey].pkgJSON;

    if (pkgJSON.dependencies && pkgJSON.dependencies[pkgName])
      dependents.dependencyDependents.push({ absPath, pkgJSON });
    if (pkgJSON.peerDependencies && pkgJSON.peerDependencies[pkgName])
      dependents.peerDependencyDependents.push({ absPath, pkgJSON });
    if (pkgJSON.devDependencies && pkgJSON.devDependencies[pkgName])
      dependents.devDependencyDependents.push({ absPath, pkgJSON });
  });

  return {
    absPath: indexInputs[pkgName].absPath,
    pkgJSON: indexInputs[pkgName].pkgJSON,
    dependents
  };
}

/**
 * @param {Object.<IndexInputElement>} indexInputs
 * @returns {Object.<IndexInfo>} each mapping in given indexInputs is transformed into an IndexInfo.
 */
function indexAll(indexInputs) {
  return Object.keys(indexInputs).reduce((acc, indexInputsKey) => {
    acc[indexInputsKey] = indexOne(indexInputs, indexInputsKey);
    return acc;
  }, {});
}

function _filter(result, indexInfos, pkgName) {
  var dependents = result[pkgName].dependents;
  var indexInputElements = dependents.dependencyDependents.concat(dependents.peerDependencyDependents).concat(dependents.devDependencyDependents);
  indexInputElements.forEach(el => {
    result[el.pkgJSON.name] = indexInfos[el.pkgJSON.name];
    _filter(result, indexInfos, el.pkgJSON.name);
  });
  return result;
}

/**
 * Filters indexInfos to only include info on pkgName and any of its dependents recursively
 * @param  {Object.<IndexInfo>}       indexInfos the result of indexing
 * @param  {string} pkgName           the first thing to filter by. This changes with each new dependent found
 * @return {Object.<IndexInfos>}      a filtered out indexInfos based on pkgName and its dependents
 */
function filter(indexInfos, pkgName) {
  var pkgIndexInfo = indexInfos[pkgName];
  var tmpResult = {};
  tmpResult[pkgName] = pkgIndexInfo;
  return _filter(tmpResult, indexInfos, pkgName)
}

module.exports = {
  indexOne,
  indexAll,
  filter
};
