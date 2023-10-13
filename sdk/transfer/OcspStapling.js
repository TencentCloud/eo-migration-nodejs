function OcspStapling(domain, domainConfig) {
  const keyConfig = domainConfig.Https.OcspStapling;
  if (!keyConfig || keyConfig === 'off') {
    return null;
  }

  return {
    'NormalAction': {
      'Action': 'OcspStapling',
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

module.exports = OcspStapling;