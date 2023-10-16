'use strict';

const _ = require('lodash');
const base = require('./base');
const API = require('./api');
var pkg = require('../package.json');

const defaultOptions = {
  SecretId: '',
  SecretKey: '',
};

const CDN2EO = function (options) {
  this.options = _.extend(_.clone(defaultOptions), options || {});
  this.API = new API(options.SecretId, options.SecretKey);
};

base.init(CDN2EO);
CDN2EO.version = pkg.version;

module.exports = CDN2EO;
