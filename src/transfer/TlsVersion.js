function TlsVersion(domain, domainConfig, ruleTransferLog) {
  const keyConfig = domainConfig.Https.TlsVersion;
  if (!keyConfig) {
    ruleTransferLog.push({
      config: 'TLS版本配置(Https.TlsVersion)',
      result: '未配置',
      detail: ''
    });
    return null;
  }

  ruleTransferLog.push({
    config: 'TLS版本配置(Https.TlsVersion)',
    result: '成功',
    detail: ''
  });

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