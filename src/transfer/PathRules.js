
function PathRules(domain, domainConfig, ruleTransferLog) {
  const keyConfig = domainConfig.Origin.PathRules;
  if (!keyConfig || !keyConfig.length) {
    ruleTransferLog.push({
      config: '回源路径重写规则配置(Origin.PathRules)',
      result: '未配置',
      detail: ''
    });
    return null;
  }
  const eoRules = [];

  keyConfig.reverse().forEach(rule => {
    eoRules.push({
      'Conditions': [
        {
          'Conditions': [
            {
              'Operator': 'equal',
              'Target': rule.FullMatch ? 'full_url' : 'url',
              'IgnoreCase': false,
              'Values': rule.FullMatch ? [`https://${domain}${rule.Path}`] : [rule.Path]
            }
          ]
        }
      ],
      'Actions': [
        {
          'NormalAction': {
            'Action': 'UpstreamUrlRedirect',
            'Parameters': [
              {
                'Name': 'Type',
                'Values': [
                  'Path'
                ]
              },
              {
                'Name': 'Action',
                'Values': [
                  'replace'
                ]
              },
              {
                'Name': 'Value',
                'Values': [rule.ForwardUri]
              }
            ]
          }
        }
      ]
    });
  });

  ruleTransferLog.push({
    config: '回源路径重写规则配置(Origin.PathRules)',
    result: '成功',
    detail: ''
  });

  return {
    'Rules': eoRules,
    'Tags': []
  };
}

module.exports = PathRules;