var assert = require('chai').assert;
var pkgDependents = require('../src');
var path = require('path');
var getDirectories = require('../src/getDirectories');

var fixturesPath = path.join(__dirname, 'fixtures');
var dirsInFixtures = getDirectories(fixturesPath).map(dirName => path.join(fixturesPath, dirName));

suite('pkg-dependents interface', function() {
  suite('#pkgDependents() no recurse', function () {
    test('check expected output with no recurse on "a" package', function (cb) {
      pkgDependents('a', {
        paths: dirsInFixtures,
        recurse: false
      }, (err, result) => {
        if (err) throw err;
        assert.isTrue(Object.keys(result).length === 1, 'should only have one key in result');
        assert.isTrue(result.a.absPath.endsWith(path.join('fixtures', 'dir1', 'a')), 'should have an absPath ending in fixtures/dir1/a');
        assert.isTrue(result.a.dependents.dependencyDependents.length === 0, 'package a has no dependency dependents');
        assert.isTrue(result.a.dependents.peerDependencyDependents.length === 0, 'package a has no peerDependency dependents');
        assert.isTrue(result.a.dependents.devDependencyDependents.length === 0, 'package a has no devDependency dependents');
        cb();
      });
    });

    test('check expected output with no recurse on "b" package', function (cb) {
      pkgDependents('b', {
        paths: dirsInFixtures,
        recurse: false
      }, (err, result) => {
        if (err) throw err;
        assert.isTrue(Object.keys(result).length === 1, 'should only have one key in result');
        assert.isTrue(result.b.absPath.endsWith(path.join('fixtures', 'dir2', 'b')), 'should have an absPath ending in fixtures/dir2/b');
        assert.isTrue(result.b.dependents.dependencyDependents.length === 1, 'package b has a single dependency dependent');
        assert.isTrue(result.b.dependents.dependencyDependents[0].pkgJSON.name === 'a', 'package b has a dependency dependent on package a');
        assert.isTrue(result.b.dependents.peerDependencyDependents.length === 0, 'package b has no peerDependency dependents');
        assert.isTrue(result.b.dependents.devDependencyDependents.length === 0, 'package b has no devDependency dependents');
        cb();
      });
    });
  });

  suite('#pkgDependents() with recurse', function () {
    test('check expected output with recurse on "d" package', function (cb) {
      pkgDependents('d', {
        paths: dirsInFixtures,
        recurse: true
      }, (err, result) => {
        if (err) throw err;
        assert.isTrue(Object.keys(result).length === 3, 'should only have 3 keys in result');

        assert.isTrue(result.d.absPath.endsWith(path.join('fixtures', 'dir2', 'd')), 'should have an absPath ending in fixtures/dir2/d');
        assert.isTrue(result.d.dependents.dependencyDependents.length === 0, 'package d has no dependency dependents');
        assert.isTrue(result.d.dependents.peerDependencyDependents.length === 1, 'package d has 1 peerDependency dependent');
        assert.isTrue(result.d.dependents.peerDependencyDependents[0].pkgJSON.name === 'a', 'package d has a peerDependency dependent on package a');
        assert.isTrue(result.d.dependents.devDependencyDependents.length === 1, 'package a has 1 devDependency dependent');
        assert.isTrue(result.d.dependents.devDependencyDependents[0].pkgJSON.name === 'b', 'package d has a devDependency dependent on package b');

        assert.isTrue(result.a.absPath.endsWith(path.join('fixtures', 'dir1', 'a')), 'should have an absPath ending in fixtures/dir1/a');
        assert.isTrue(result.a.dependents.dependencyDependents.length === 0, 'package a has no dependency dependents');
        assert.isTrue(result.a.dependents.peerDependencyDependents.length === 0, 'package a has no peerDependency dependents');
        assert.isTrue(result.a.dependents.devDependencyDependents.length === 0, 'package a has no devDependency dependents');

        assert.isTrue(result.b.absPath.endsWith(path.join('fixtures', 'dir2', 'b')), 'should have an absPath ending in fixtures/dir2/b');
        assert.isTrue(result.b.dependents.dependencyDependents.length === 1, 'package b has a single dependency dependent');
        assert.isTrue(result.b.dependents.dependencyDependents[0].pkgJSON.name === 'a', 'package b has a dependency dependent on package a');
        assert.isTrue(result.b.dependents.peerDependencyDependents.length === 0, 'package b has no peerDependency dependents');
        assert.isTrue(result.b.dependents.devDependencyDependents.length === 0, 'package b has no devDependency dependents');
        cb();
      });
    });
  });

});
