function Http2(domain, domainConfig) {
  const keyConfig = domainConfig.Https.Http2;
  if (!keyConfig || keyConfig === 'off') {
    return null;
  }

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