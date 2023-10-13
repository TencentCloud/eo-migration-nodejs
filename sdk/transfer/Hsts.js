function Hsts(domain, domainConfig) {
  const keyConfig = domainConfig.Https.Hsts;
  if (!keyConfig || keyConfig.Switch === 'off') {
    return null;
  }

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