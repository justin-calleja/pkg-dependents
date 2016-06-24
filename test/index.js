// var assert = require('chai').assert;
// var pkgDependents = require('../lib');
// var dependents = require('./fixtures/dependents');
//
//
//   describe('#pkgDependents()', function () {
//     it('expect undefined value for abc123 key in result since it does not exist in input', function (cb) {
//       pkgDependents(abc, {
//         pkgName: 'abc123',
//         recurse: false
//       }, (err, result) => {
//         assert.isTrue(Object.keys(result).length === 1, 'should only have one key in result');
//         assert.property(result, 'abc123', 'should have a key abc123');
//         assert.isUndefined(result.abc123, 'expect undefined value for abc123 package since it does not exist in given data structure');
//         cb();
//       });
//     });
//
//     it('expect similar result when recurse is true (to when recurse if false) for a package which cannot be found in given data structure', function (cb) {
//       pkgDependents(abc, {
//         pkgName: 'abc123',
//         recurse: true
//       }, (err, result) => {
//         assert.isTrue(Object.keys(result).length === 1, 'should only have one key in result');
//         assert.property(result, 'abc123', 'should have a key abc123');
//         assert.isUndefined(result.abc123, 'expect undefined value for abc123 package since it does not exist in given data structure');
//         cb();
//       });
//     });
//
//     it('check expected output with no recurse on "a" package', function (cb) {
//       pkgDependents(abc, {
//         pkgName: 'a',
//         recurse: false
//       }, (err, result) => {
//         if (err) throw err;
//         assert.isTrue(Object.keys(result).length === 1, 'should only have one key in result');
//         assert.isTrue(result.a.absPath.endsWith(path.join('fixtures', 'dir1', 'a')), 'should have an absPath ending in fixtures/dir1/a');
//         assert.isTrue(Object.keys(result.a.dependents.dependencyDependents).length === 0, 'package a has no dependency dependents');
//         assert.isTrue(Object.keys(result.a.dependents.peerDependencyDependents).length === 0, 'package a has no peerDependency dependents');
//         assert.isTrue(Object.keys(result.a.dependents.devDependencyDependents).length === 0, 'package a has no devDependency dependents');
//         cb();
//       });
//     });
//
//     it('check expected output with no recurse on "b" package', function (cb) {
//       pkgDependents(abc, {
//         pkgName: 'b',
//         recurse: false
//       }, (err, result) => {
//         if (err) throw err;
//         assert.isTrue(Object.keys(result).length === 1, 'should only have one key in result');
//         assert.isTrue(result.b.absPath.endsWith(path.join('fixtures', 'dir2', 'b')), 'should have an absPath ending in fixtures/dir2/b');
//         assert.isTrue(Object.keys(result.b.dependents.dependencyDependents).length === 1, 'package b has a single dependency dependent');
//         assert.isTrue(result.b.dependents.dependencyDependents.a.pkgJSON.name === 'a', 'package b has a dependency dependent on package a');
//         assert.isTrue(Object.keys(result.b.dependents.peerDependencyDependents).length === 0, 'package b has no peerDependency dependents');
//         assert.isTrue(Object.keys(result.b.dependents.devDependencyDependents).length === 0, 'package b has no devDependency dependents');
//         cb();
//       });
//     });
//
//     it('check expected output with recurse on "d" package', function (cb) {
//       pkgDependents(abc, {
//         pkgName: 'd',
//         recurse: true
//       }, (err, result) => {
//         if (err) throw err;
//         assert.isTrue(Object.keys(result).length === 3, 'should only have 3 keys in result');
//
//         assert.isTrue(result.d.absPath.endsWith(path.join('fixtures', 'dir2', 'd')), 'should have an absPath ending in fixtures/dir2/d');
//         assert.isTrue(Object.keys(result.d.dependents.dependencyDependents).length === 0, 'package d has no dependency dependents');
//         assert.isTrue(Object.keys(result.d.dependents.peerDependencyDependents).length === 1, 'package d has 1 peerDependency dependent');
//         assert.isTrue(result.d.dependents.peerDependencyDependents.a.pkgJSON.name === 'a', 'package d has a peerDependency dependent on package a');
//         assert.isTrue(Object.keys(result.d.dependents.devDependencyDependents).length === 1, 'package d has 1 devDependency dependent');
//         assert.isTrue(result.d.dependents.devDependencyDependents.b.pkgJSON.name === 'b', 'package d has a devDependency dependent on package b');
//
//         assert.isTrue(result.a.absPath.endsWith(path.join('fixtures', 'dir1', 'a')), 'should have an absPath ending in fixtures/dir1/a');
//         assert.isTrue(Object.keys(result.a.dependents.dependencyDependents).length === 0, 'package a has no dependency dependents');
//         assert.isTrue(Object.keys(result.a.dependents.peerDependencyDependents).length === 0, 'package a has no peerDependency dependents');
//         assert.isTrue(Object.keys(result.a.dependents.devDependencyDependents).length === 0, 'package a has no devDependency dependents');
//
//         assert.isTrue(result.b.absPath.endsWith(path.join('fixtures', 'dir2', 'b')), 'should have an absPath ending in fixtures/dir2/b');
//         assert.isTrue(Object.keys(result.b.dependents.dependencyDependents).length === 1, 'package b has a single dependency dependent');
//         assert.isTrue(result.b.dependents.dependencyDependents.a.pkgJSON.name === 'a', 'package b has a dependency dependent on package a');
//         assert.isTrue(Object.keys(result.b.dependents.peerDependencyDependents).length === 0, 'package b has no peerDependency dependents');
//         assert.isTrue(Object.keys(result.b.dependents.devDependencyDependents).length === 0, 'package b has no devDependency dependents');
//         cb();
//       });
//     });
//
//     it('if pkgName is not given, expect to get a datastructure which gives info on all '
//           + 'packages and their dependents (recurse option is ignored)', function (cb) {
//       pkgDependents(abc, {
//         pkgName: null
//       }, (err, result) => {
//         if (err) throw err;
//         assert.equal(Object.keys(result).length, 7, 'should have 7 keys in result, one for every directory in paths with a package.json');
//         assert.isFalse(result.a === undefined, 'should have dependents info on pkg a');
//         assert.isFalse(result.b === undefined, 'should have dependents info on pkg b');
//         assert.isFalse(result.c === undefined, 'should have dependents info on pkg c');
//         assert.isFalse(result.d === undefined, 'should have dependents info on pkg d');
//         assert.isFalse(result.e === undefined, 'should have dependents info on pkg e');
//         assert.isFalse(result.f === undefined, 'should have dependents info on pkg f');
//         assert.isFalse(result.g === undefined, 'should have dependents info on pkg g');
//         cb();
//       });
//     });
//   });
//
// });
