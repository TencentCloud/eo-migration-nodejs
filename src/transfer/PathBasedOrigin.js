const utils = require('../utils');

function PathBasedOrigin(domain, domainConfig) {
  const keyConfig = domainConfig.Origin.PathBasedOrigin;
  if (!keyConfig || !keyConfig.length) {
    return null;
  }
  const eoRules = [];
  keyConfig.reverse().forEach(rule => {
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
                'Values': origin
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
      ],
      'SubRules': []
    };
    eoRules.push(eoRule);

  });
  return {
    'Rules': eoRules,
    'Tags': []
  };
}

module.exports = PathBasedOrigin;