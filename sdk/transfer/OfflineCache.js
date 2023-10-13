function OfflineCache(domain, domainConfig) {
  const keyConfig = domainConfig.OfflineCache;
  if (keyConfig.Switch !== 'on') {
    return null;
  }

  return {
    'NormalAction': {
      'Action': 'OfflineCache',
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

module.exports = OfflineCache;