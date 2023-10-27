const utils = require('../utils');

function MaxAge(domain, domainConfig, ruleTransferLog) {
  const keyConfig = domainConfig.MaxAge;
  if (!keyConfig || !keyConfig.MaxAgeRules || !keyConfig.MaxAgeRules.length || keyConfig.Switch !== 'on') {
    ruleTransferLog.push({
      config: '浏览器缓存过期配置(MaxAge)',
      result: '未配置',
      detail: ''
    });
    return null;
  }
  const { MaxAgeRules } = keyConfig;
  const eoRules = [];
  // 反向添加规则(CDN的规则优先级跟EO相反)
  MaxAgeRules.reverse().forEach(rule => {
    let eoRule = {};
    if (rule.MaxAgeType === 'all') {
      eoRule = {
        'Conditions': [
          {
            'Conditions': [
              {
                'Operator': 'equal',
                'Target': 'host',
                'Values': [
                  'all'
                ]
              }
            ]
          }
        ],
        'Actions': []
      };
    } else {
      eoRule = {
        'Conditions': [
          {
            'Conditions': [
              {
                'Operator': 'equal',
                'Target': utils.getTarget(rule.MaxAgeType),
                'IgnoreCase': false,
                'Values': rule.MaxAgeType === 'path' ? rule.MaxAgeContents.map(path => {
                  return `https://${domain}${path}`;
                }) : rule.MaxAgeContents
              }
            ]
          }
        ],
        'Actions': []
      };
    }
    eoRule.Actions.push({
      'NormalAction': {
        'Action': 'MaxAge',
        'Parameters': [
          {
            'Name': 'FollowOrigin',
            'Values': [rule.FollowOrigin]
          },
          {
            'Name': 'MaxAgeTime',
            'Values': [String(rule.MaxAgeTime)]
          }
        ]
      }
    });
    eoRules.push(eoRule);
  });

  ruleTransferLog.push({
    config: '浏览器缓存过期配置(MaxAge)',
    result: '成功',
    detail: ''
  });

  return {
    'Rules': eoRules,
    'Tags': []
  };

}

module.exports = MaxAge;