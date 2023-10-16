const utils = require('../utils');

function CacheKey(domain, domainConfig) {
  const keyConfig = domainConfig.CacheKey;
  if (!keyConfig) {
    return null;
  }
  const { KeyRules } = keyConfig;
  const eoRules = [];
  // 反向添加规则(CDN的规则优先级跟EO相反)
  KeyRules.reverse().forEach(rule => {
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
      'Actions': [{
        'NormalAction': {
          'Action': 'CacheKey',
          'Parameters': [
            {
              'Name': 'FullUrlCache',
              'Values': [rule.FullUrlCache]
            },
            {
              'Name': 'Type',
              'Values': [
                'QueryString'
              ]
            },
            {
              'Name': 'Switch',
              'Values': [rule.QueryString.Switch]
            },
            {
              'Name': 'Value',
              'Values': rule.QueryString.Value ? rule.QueryString.Value.split(';') : []
            }
          ]
        }
      }]
    };

    if (rule.QueryString.Action) {
      eoRule.Actions[0].NormalAction.Parameters.push({
        'Name': 'Action',
        'Values': [rule.QueryString.Action]
      });
    }
    eoRule.Actions[0].NormalAction.Parameters.push({
      'Name': 'Type',
      'Values': [
        'IgnoreCase'
      ]
    }, {
      'Name': 'Switch',
      'Values': [rule.IgnoreCase]
    });
    eoRules.push(eoRule);
  });

  let allFileRule = {
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
          'Action': 'CacheKey',
          'Parameters': [
            {
              'Name': 'FullUrlCache',
              'Values': [keyConfig.FullUrlCache]
            },
            {
              'Name': 'Type',
              'Values': [
                'QueryString'
              ]
            },
            {
              'Name': 'Switch',
              'Values': [keyConfig.QueryString.Switch]
            },
            {
              'Name': 'Value',
              'Values': keyConfig.QueryString.Value ? keyConfig.QueryString.Value.split(';') : []
            }
          ]
        }
      }
    ]
  };
  if (keyConfig.QueryString.Action) {
    allFileRule.Actions[0].NormalAction.Parameters.push({
      'Name': 'Action',
      'Values': [keyConfig.QueryString.Action]
    });
  }
  allFileRule.Actions[0].NormalAction.Parameters.push({
    'Name': 'Type',
    'Values': [
      'IgnoreCase'
    ]
  }, {
    'Name': 'Switch',
    'Values': [keyConfig.IgnoreCase]
  });
  eoRules.push(allFileRule);

  return {
    'Rules': eoRules,
    'Tags': []
  };

}

module.exports = CacheKey;