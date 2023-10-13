function Quic(domain, domainConfig) {
  const keyConfig = domainConfig.Quic;
  if (keyConfig.Switch !== 'on') {
    return null;
  }
  return {
    'NormalAction': {
      'Action': 'Quic',
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

module.exports = Quic;