
function OriginPullProtocol(domain, domainConfig) {
  const keyConfig = domainConfig.Origin.OriginPullProtocol;
  if (!keyConfig) {
    return null;
  }

  return {
    'NormalAction': {
      'Action': 'OriginPullProtocol',
      'Parameters': [
        {
          'Name': 'Protocol',
          'Values': [keyConfig]
        }
      ]
    }
  };

}

module.exports = OriginPullProtocol;