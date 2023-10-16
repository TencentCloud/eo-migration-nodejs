const utils = require('../utils');

function Cache(domain, domainConfig) {
  const keyConfig = domainConfig.Cache;
  if (!keyConfig || !keyConfig.RuleCache || !keyConfig.RuleCache.length) {
    return null;
  }
  const { RuleCache } = keyConfig;
  const eoRules = [];
  RuleCache.reverse().forEach(rule => {
    let eoRule = {};

    if (rule.RuleType === 'all') {
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
        'Actions': [],
      };
    }
    else if (rule.RuleType === 'regex') {
      eoRule = {
        'Conditions': [],
        'Actions': [],
      };
      rule.RulePaths.forEach(path => {
        eoRule.Conditions.push({
          'Conditions': [
            {
              'Operator': 'regular',
              'Target': 'full_url',
              'IgnoreCase': false,
              'Values': [path]
            }
          ]
        });
      });
    } else {
      eoRule = {
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
        'Actions': [],
      };
    }

    if (rule.CacheConfig.NoCache.Switch === 'on') {
      eoRule.Actions.push({
        'NormalAction': {
          'Action': 'Cache',
          'Parameters': [
            {
              'Name': 'Type',
              'Values': [
                'NoCache'
              ]
            },
            {
              'Name': 'Switch',
              'Values': [
                'on'
              ]
            }
          ]
        }
      });
    }
    else if (rule.CacheConfig.FollowOrigin.Switch === 'on' && rule.CacheConfig.FollowOrigin.HeuristicCache.Switch === 'on') {
      eoRule.Actions.push({
        'NormalAction': {
          'Action': 'Cache',
          'Parameters': [
            {
              'Name': 'Type',
              'Values': [
                'FollowOrigin'
              ]
            },
            {
              'Name': 'Switch',
              'Values': [
                'on'
              ]
            },
            {
              'Name': 'DefaultCache',
              'Values': [rule.CacheConfig.FollowOrigin.HeuristicCache.Switch]
            },
            {
              'Name': 'DefaultCacheStrategy',
              'Values': [rule.CacheConfig.FollowOrigin.HeuristicCache.CacheConfig.HeuristicCacheTimeSwitch === 'on' ? 'off' : 'on']
            },
            {
              'Name': 'DefaultCacheTime',
              'Values': [String(rule.CacheConfig.FollowOrigin.HeuristicCache.CacheConfig.HeuristicCacheTime)]
            }
          ]
        }
      });
    } else if (rule.CacheConfig.FollowOrigin.Switch === 'on' && rule.CacheConfig.FollowOrigin.HeuristicCache.Switch === 'off') {
      eoRule.Actions.push({
        'NormalAction': {
          'Action': 'Cache',
          'Parameters': [
            {
              'Name': 'Type',
              'Values': [
                'FollowOrigin'
              ]
            },
            {
              'Name': 'Switch',
              'Values': [
                'on'
              ]
            },
            {
              'Name': 'DefaultCache',
              'Values': ['off']
            }
          ]
        }
      });
    } else {
      eoRule.Actions.push({
        'NormalAction': {
          'Action': 'Cache',
          'Parameters': [
            {
              'Name': 'Type',
              'Values': [
                'Cache'
              ]
            },
            {
              'Name': 'Switch',
              'Values': [
                'on'
              ]
            },
            {
              'Name': 'IgnoreCacheControl',
              'Values': [rule.CacheConfig.Cache.IgnoreCacheControl]
            },
            {
              'Name': 'CacheTime',
              'Values': [String(rule.CacheConfig.Cache.CacheTime)]
            }
          ]
        }
      });
    }
    eoRules.push(eoRule);
  });

  return {
    'Rules': eoRules,
    'Tags': []
  };
}

module.exports = Cache;