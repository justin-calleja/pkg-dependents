var assert = require('chai').assert;
var dependentsOps = require('../lib').dependentsOps;
var constants = require('../lib').constants;
var PJIDConstants = require('pkg-json-info-dict').constants;
var dependents = require('./fixtures/dependents.json');

describe('dependentsOps', function () {
  it('reduceDependents', function () {
    var result = dependentsOps.reduceDependents(dependents, (acc, dependentName, ofDependentType, ofDependencyType) => {
      acc.push({
        dependentName,
        ofDependentType,
        ofDependencyType
      });
      return acc;
    }, []);
    assert.equal(result.length, 3, 'expecting 2 peers and 1 dev dependency dependents');
    var resultA = result.find(res => res.dependentName == 'a');
    assert.equal(resultA.ofDependentType, constants.P_DEPENDENT, `expecting an ofDependentType of ${constants.P_DEPENDENT}`);
    assert.equal(resultA.ofDependencyType, PJIDConstants.PEER_DEPENDENCIES, `expecting an ofDependencyType of ${PJIDConstants.PEER_DEPENDENCIES}`);
  });
});
