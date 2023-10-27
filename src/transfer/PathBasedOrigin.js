const utils = require('../utils');
const logger = require('../logger');

function PathBasedOrigin(domain, domainConfig, ruleTransferLog) {
  const keyConfig = domainConfig.Origin.PathBasedOrigin;
  if (!keyConfig || !keyConfig.length) {
    ruleTransferLog.push({
      config: '分路径回源配置(Origin.PathBasedOrigin)',
      result: '未配置',
      detail: ''
    });
    return null;
  }

  const pathConfig = keyConfig.filter(rule => {
    return rule.RuleType === 'path';
  });

  if (pathConfig && pathConfig.length > 0) {
    logger.error('EO不支持修改全路径文件的回源配置');
  }

  const newKeyConfig = keyConfig.filter(rule => {
    return rule.RuleType !== 'path';
  });

  const eoRules = [];
  newKeyConfig.reverse().forEach(rule => {
    const [origin, port, weight] = rule.Origin[0].split(':');

    let eoRule = {
      'Conditions': [
        {
          'Conditions': [
            {
              'Operator': 'equal',
              'Target': utils.getTarget(rule.RuleType),
              'IgnoreCase': false,
              'Values': rule.RuleType === 'path' ? rule.RulePaths.map(path => {
                return `https://${domain}${path}`;
              }) : rule.RulePaths
            }
          ]
        }
      ],
      'Actions': [
        {
          'NormalAction': {
            'Action': 'Origin',
            'Parameters': [
              {
                'Name': 'Type',
                'Values': [
                  'IP_DOMAIN'
                ]
              },
              {
                'Name': 'DomainName',
                'Values': [origin]
              },
              {
                'Name': 'OriginProtocol',
                'Values': [
                  'follow'
                ]
              },
              {
                'Name': 'HttpOriginPort',
                'Values': [port !== undefined ? port : '80']
              },
              {
                'Name': 'HttpsOriginPort',
                'Values': [port !== undefined ? port : '443']
              }
            ]
          }
        }
      ]
    };
    eoRules.push(eoRule);

  });

  if (pathConfig && pathConfig.length > 0) {
    ruleTransferLog.push({
      config: '分路径回源配置(Origin.PathBasedOrigin)',
      result: '部分失败',
      detail: 'EO不支持修改全路径文件的回源配置'
    });
  }
  else {
    ruleTransferLog.push({
      config: '分路径回源配置(Origin.PathBasedOrigin)',
      result: '成功',
      detail: ''
    });

  }
  return {
    'Rules': eoRules,
    'Tags': []
  };
}

module.exports = PathBasedOrigin;