const utils = require('../utils');

function RequestHeader(domain, domainConfig) {
  const keyConfig = domainConfig.RequestHeader;
  if (!keyConfig || !keyConfig.HeaderRules || !keyConfig.HeaderRules.length || keyConfig.Switch !== 'on') {
    return null;
  }
  const { HeaderRules } = keyConfig;
  const eoRules = [];
  // 反向添加规则(CDN的规则优先级跟EO相反)
  HeaderRules.reverse().forEach(rule => {
    let eoRule = {};
    if (utils.getTarget(rule.RuleType) !== 'host') {
      eoRule = {
        'Rules': [
          {
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
            'Actions': []
          }
        ],
        'Tags': []
      };
    }
    else {
      eoRule = {
        'Rules': [
          {
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
          }
        ],
        'Tags': []
      };
    }

    if (rule.HeaderMode === 'del') {
      eoRule.Rules[0].Actions.push({
        'RewriteAction': {
          'Action': 'RequestHeader',
          'Parameters': [
            {
              'Action': rule.HeaderMode,
              'Name': rule.HeaderName,
            }
          ]
        }
      });
    }
    else {
      eoRule.Rules[0].Actions.push({
        'RewriteAction': {
          'Action': 'RequestHeader',
          'Parameters': [
            {
              'Action': rule.HeaderMode,
              'Name': rule.HeaderName,
              'Values': [rule.HeaderValue]
            }
          ]
        }
      });
    }

    eoRules.push(eoRule);
  });

  return eoRules;
}

module.exports = RequestHeader;