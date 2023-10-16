function WebSocket(domain, domainConfig) {
  const keyConfig = domainConfig.WebSocket;
  if (keyConfig.Switch !== 'on') {
    return null;
  }
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