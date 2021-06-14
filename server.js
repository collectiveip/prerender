var prerender = require('./lib');
require('./config');

var server = prerender();

//server.use(require('prerender-aws-s3-cache'))
server.use(require('./azureStorageService'))
server.use(prerender.bearerAuth());
server.use(prerender.sendPrerenderHeader());
server.use(prerender.browserForceRestart());
// server.use(prerender.blockResources());a
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());

server.start();
