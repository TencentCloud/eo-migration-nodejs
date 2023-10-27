function Hsts(domain, domainConfig, ruleTransferLog) {
  const keyConfig = domainConfig.Https.Hsts;
  if (!keyConfig || keyConfig.Switch === 'off') {
    ruleTransferLog.push({
      config: 'HSTS配置(Https.Hsts)',
      result: '未配置',
      detail: ''
    });
    return null;
  }

  ruleTransferLog.push({
    config: 'HSTS配置(Https.Hsts)',
    result: '成功',
    detail: ''
  });

  return {
    'NormalAction': {
      'Action': 'Hsts',
      'Parameters': [
        {
          'Name': 'Switch',
          'Values': [
            'on'
          ]
        },
        {
          'Name': 'MaxAge',
          'Values': [String(keyConfig.MaxAge)]
        },
        {
          'Name': 'IncludeSubDomains',
          'Values': [keyConfig.IncludeSubDomains]
        },
        {
          'Name': 'Preload',
          'Values': [
            'off'
          ]
        }
      ]
    }
  };
}

module.exports = Hsts;