// NOTE: repl.js depends on tsc output.
// Make sure you've transpiled with `npm run build` before using: node ./test/repl.js
var repl = require('repl');
var path = require('path');
var getDirectories = require('../lib/getDirectories').default;
var pathsToIndexInputs = require('../lib/pathsToIndexInputs').default;
var indexOps = require('../lib/indexOps');

var replServer = repl.start({
  prompt: '> '
});

replServer.context.getDirectories = getDirectories;
replServer.context.pathsToIndexInputs = pathsToIndexInputs;
replServer.context.indexOne = indexOps.indexOne;
replServer.context.indexAll = indexOps.indexAll;
replServer.context.filter = indexOps.filter;

var fixturesPath = replServer.context.fixturesPath = path.resolve(__dirname, './fixtures');
replServer.context.dir1 = path.join(fixturesPath, 'dir1');
replServer.context.dir2 = path.join(fixturesPath, 'dir2');
var dirsInFixtures = replServer.context.dirsInFixtures = getDirectories(fixturesPath).map(dirName => path.join(fixturesPath, dirName));

var indexInputs = replServer.context.indexInputs = pathsToIndexInputs(dirsInFixtures);
replServer.context.indexAllResult = indexOps.indexAll(indexInputs);
