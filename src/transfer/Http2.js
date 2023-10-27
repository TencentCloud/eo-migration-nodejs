function Http2(domain, domainConfig, ruleTransferLog) {
  const keyConfig = domainConfig.Https.Http2;
  if (!keyConfig || keyConfig === 'off') {
    ruleTransferLog.push({
      config: 'HTTP 2.0配置(Https.Http2)',
      result: '未配置',
      detail: ''
    });
    return null;
  }

  ruleTransferLog.push({
    config: 'HTTP 2.0配置(Https.Http2)',
    result: '成功',
    detail: ''
  });

  return {
    'NormalAction': {
      'Action': 'Http2',
      'Parameters': [
        {
          'Name': 'Switch',
          'Values': [
            'on'
          ]
        }
      ]
    }
  };
}

module.exports = Http2;