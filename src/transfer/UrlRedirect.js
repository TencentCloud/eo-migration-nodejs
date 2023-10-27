const utils = require('../utils');

function UrlRedirect(domain, domainConfig, ruleTransferLog) {
  const keyConfig = domainConfig.UrlRedirect;
  if (!keyConfig || !keyConfig.PathRules || !keyConfig.PathRules.length || keyConfig.Switch !== 'on') {
    ruleTransferLog.push({
      config: '回源URL重写配置(UrlRedirect)',
      result: '未配置',
      detail: ''
    });
    return null;
  }
  const { PathRules } = keyConfig;
  const eoRules = [];
  // 反向添加规则(CDN的规则优先级跟EO相反)
  PathRules.reverse().forEach(rule => {
    const [protocol, redirectdomain] = rule.RedirectHost.split('://');
    let eoRule = {
      'Conditions': [],
      'Actions': [{
        'NormalAction': {
          'Action': 'AccessUrlRedirect',
          'Parameters': [
            {
              'Name': 'StatusCode',
              'Values': [
                '302'
              ]
            },
            {
              'Name': 'Type',
              'Values': [
                'Protocol'
              ]
            },
            {
              'Name': 'Action',
              'Values': [
                'custom'
              ]
            },
            {
              'Name': 'Value',
              'Values': [protocol]
            },
            {
              'Name': 'Type',
              'Values': [
                'HostName'
              ]
            },
            {
              'Name': 'Action',
              'Values': [
                'custom'
              ]
            },
            {
              'Name': 'Value',
              'Values': [redirectdomain]
            },
            {
              'Name': 'Type',
              'Values': [
                'Url'
              ]
            },
            {
              'Name': 'Action',
              'Values': [
                'custom'
              ]
            },
            {
              'Name': 'Value',
              'Values': [rule.RedirectUrl]
            },
            {
              'Name': 'Type',
              'Values': [
                'QueryString'
              ]
            },
            {
              'Name': 'Action',
              'Values': [
                'ignore'
              ]
            }
          ]
        }
      }]
    };
    if (rule.FullMatch) {
      eoRule.Conditions.push({
        'Conditions': [
          {
            'Operator': 'equal',
            'Target': 'full_url',
            'IgnoreCase': false,
            'Values': [`https://${domain}${rule.Pattern}`]
          }
        ]
      });
    }
    else if (!rule.FullMatch && !rule.Regex) {
      eoRule.Conditions.push({
        'Conditions': [
          {
            'Operator': 'equal',
            'Target': 'url',
            'IgnoreCase': false,
            'Values': [rule.Pattern]
          }
        ]
      });
    }
    else {
      eoRule.Conditions.push({
        'Conditions': [
          {
            'Operator': 'regular',
            'Target': 'full_url',
            'IgnoreCase': false,
            'Values': [rule.Pattern]
          }
        ]
      });
    }
    eoRules.push(eoRule);
  });

  ruleTransferLog.push({
    config: '回源URL重写配置(UrlRedirect)',
    result: '成功',
    detail: ''
  });

  return {
    'Rules': eoRules,
    'Tags': []
  };
}

module.exports = UrlRedirect;