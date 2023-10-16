function TlsVersion(domain, domainConfig) {
  const keyConfig = domainConfig.Https.TlsVersion;
  if (!keyConfig) {
    return null;
  }

  return {
    'NormalAction': {
      'Action': 'SslTlsSecureConf',
      'Parameters': [
        {
          'Name': 'TlsVersion',
          'Values': keyConfig
        },
        {
          'Name': 'CipherSuite',
          'Values': [
            'loose-v2023'
          ]
        }
      ]
    }
  };
}

module.exports = TlsVersion;