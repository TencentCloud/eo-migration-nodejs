var CDN2EO = require('./index');
var config = require('./config.json');

var cdn2eo = new CDN2EO({
  SecretId: config.SecretId,
  SecretKey: config.SecretKey,
});

cdn2eo.runTasks({
  DomainZoneMaps: config.List,
  NeedCreateDomain: config.NeedCreateDomain
});
