const utils = require('../utils');

function RangeOriginPull(domain, domainConfig) {
  const keyConfig = domainConfig.RangeOriginPull;
  if (!keyConfig || !keyConfig.RangeRules || !keyConfig.RangeRules.length) {
    return null;
  }

  const { RangeRules, Switch } = keyConfig;
  const eoRules = [];
  // 反向添加规则(CDN的规则优先级跟EO相反)
  RangeRules.reverse().forEach(rule => {
    eoRules.push({
      'Actions': [
        {
          'CodeAction': null,
          'NormalAction': {
            'Action': 'RangeOriginPull',
            'Parameters': [
              {
                'Name': 'Switch',
                'Values': [rule.Switch]
              }
            ]
          },
          'RewriteAction': null
        }
      ],
      'Conditions': [
        {
          'Conditions': [
            {
              'IgnoreCase': false,
              'IgnoreNameCase': false,
              'Operator': 'equal',
              'Target': utils.getTarget(rule.RuleType),
              'Values': rule.RuleType === 'path' ? rule.RulePaths.map(path => {
                return `https://${domain}${path}`;
              }) : rule.RulePaths
            }
          ]
        }
      ]
    });
  });
  // 添加全部文件
  eoRules.push({
    'Conditions': eoRules?.length > 0 ? [] : [
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
    'Actions': [
      {
        'NormalAction': {
          'Action': 'RangeOriginPull',
          'Parameters': [
            {
              'Name': 'Switch',
              'Values': [Switch]
            }
          ]
        }
      }
    ]
  });

  return {
    'Rules': eoRules,
    'Tags': []
  };
}

module.exports = RangeOriginPull;