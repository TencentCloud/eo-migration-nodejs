// 工具方法，包含对配置进行组装，判断优先级，条件去重，参数合法性校验等功能

function testIp(value) {
  let $reg_is_ip = /^((([0-9]?[0-9])|(1[0-9]{2})|(2[0-4][0-9])|(25[0-5]))\.){3}(([0-9]?[0-9])|(1[0-9]{2})|(2[0-4][0-9])|(25[0-5]))$/;
  return $reg_is_ip.test(value);
}

function testIpv6(value) {
  let $reg_is_ipv6 = /^((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?$/;
  return $reg_is_ipv6.test(value);
}

function testDomain(value) {
  var $reg_is_domain = /^(\*\.)?([a-zA-Z0-9_]([a-zA-Z0-9-_]{0,61}[a-zA-Z0-9_])?\.){1,}[a-zA-Z]{2,}$/;
  return $reg_is_domain.test(value);
}

function testIpAndPort(value) {
  if (!value) {
    return false;
  }
  var ref = value.split(':');
  if (ref.length > 2) {
    return false;
  }
  var host = ref[0];
  var port = ref[1];

  if (!testIp(host)) {
    return false;
  }
  if (port === undefined) {
    return false;
  }
  if (port === '' || !/^\d+$/.test(port) || +port > 65535 || +port == 0) {
    return false;
  }
  return true;
}

function testIpAndWeight(value) {
  var ref = value.split('::');
  var host = ref[0];
  var weight = ref[1];
  if (!testIp(host)) {
    return false;
  }
  if (weight === undefined) {
    return false;
  }
  if (weight === '' || !/^\d+$/.test(weight)) {
    return false;
  }
  return true;
}

function testIpAndPortAndWeight(value) {
  var ref = value.split(':');
  if (ref.length > 3) return false;

  var host = ref[0];
  var port = ref[1];
  var weight = ref[2];

  if (!testIp(host)) {
    return false;
  }
  if (port === undefined) {
    return false;
  }
  if (port === '' || !/^\d+$/.test(port) || +port > 65535 || +port == 0) {
    return false;
  }
  if (weight === undefined) {
    return false;
  }
  if (weight === '' || !/^\d+$/.test(weight)) {
    return false;
  }
  return true;
}

function testDomainAndPort(value) {
  if (!value) {
    return false;
  }
  var ref = value.split(':');
  var host = ref[0];
  var port = ref[1];

  if (!testDomain(host)) {
    return false;
  }
  if (port === undefined) {
    return false;
  }
  if (port === '' || !/^\d+$/.test(port) || +port > 65535 || +port == 0) {
    return false;
  }
  return true;
};

function testDomainAndWeight(value) {
  var ref = value.split('::');
  var host = ref[0];
  var weight = ref[1];

  if (!testDomain(host)) {
    return false;
  }
  if (weight === undefined) {
    return false;
  }
  if (weight === '' || !/^\d+$/.test(weight)) {
    return false;
  }
  return true;
}

function testDomainAndPortAndWeight(value) {
  var ref = value.split(':');
  var host = ref[0];
  var port = ref[1];
  var weight = ref[2];

  if (!testDomain(host)) {
    return false;
  }
  if (port === undefined) {
    return false;
  }
  if (port === '' || !/^\d+$/.test(port) || +port > 65535 || +port == 0) {
    return false;
  }
  if (weight === undefined) {
    return false;
  }
  if (weight === '' || !/^\d+$/.test(weight)) {
    return false;
  }
  return true;
}

function rulesGenerator(domain, eoRuleConfigs) {
  let baseRule = {
    Conditions: [
      {
        Conditions: [
          {
            Operator: 'equal',
            Target: 'host',
            IgnoreCase: false,
            Values: [domain]
          }
        ]
      }
    ],
    Actions: [],
    SubRules: []
  };

  Object.keys(eoRuleConfigs).map(key => {
    if (!eoRuleConfigs[key]) {
      return;
    }
    if (eoRuleConfigs[key].Rules) {
      baseRule.SubRules.push(eoRuleConfigs[key]);
    }
    else if (eoRuleConfigs[key].length > 0) {
      baseRule.SubRules = [].concat(baseRule.SubRules, eoRuleConfigs[key]);
    }
    else {
      baseRule.Actions.push(eoRuleConfigs[key]);
    }
  });

  if (baseRule.SubRules.length === 0) {
    delete baseRule.SubRules;
  }
  if (baseRule.Actions.length === 0) {
    delete baseRule.Actions;
  }


  return [baseRule];
}

function getTarget(type) {
  switch (type) {
    case 'file': return 'extension';
    case 'directory': return 'url';
    case 'path': return 'full_url';
    case 'all': return 'host';
    case 'index': return 'url';
    case 'regex': return 'full_url';
  }
}

const utils = {
  testIp,
  testDomain,
  testIpAndPort,
  testIpAndWeight,
  testIpAndPortAndWeight,
  testDomainAndPort,
  testDomainAndWeight,
  testDomainAndPortAndWeight,
  rulesGenerator,
  getTarget
};

module.exports = utils;
