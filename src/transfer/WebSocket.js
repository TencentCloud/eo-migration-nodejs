function WebSocket(domain, domainConfig, ruleTransferLog) {
  const keyConfig = domainConfig.WebSocket;
  if (keyConfig.Switch !== 'on') {
    ruleTransferLog.push({
      config: 'WebSocket配置(WebSocket)',
      result: '未配置',
      detail: ''
    });
    return null;
  }

  ruleTransferLog.push({
    config: 'WebSocket配置(WebSocket)',
    result: '成功',
    detail: ''
  });

  return {
    'NormalAction': {
      'Action': 'WebSocket',
      'Parameters': [
        {
          'Name': 'Switch',
          'Values': [
            'on'
          ]
        },
        {
          'Name': 'Timeout',
          'Values': [String(keyConfig.Timeout)]
        }
      ]
    }
  };
}

module.exports = WebSocket;