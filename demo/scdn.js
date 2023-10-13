var CDN2EO = require('../index');
var config = require('./config.json');

var cdn2eo = new CDN2EO({
  SecretId: config.SecretId,
  SecretKey: config.SecretKey,
});

cdn2eo.runScdnTasks({
  DomainZoneMaps: config.List
});
