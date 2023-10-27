function OcspStapling(domain, domainConfig, ruleTransferLog) {
  const keyConfig = domainConfig.Https.OcspStapling;
  if (!keyConfig || keyConfig === 'off') {
    ruleTransferLog.push({
      config: 'OCSP装订配置(Https.OcspStapling)',
      result: '未配置',
      detail: ''
    });
    return null;
  }

  ruleTransferLog.push({
    config: 'OCSP装订配置(Https.OcspStapling)',
    result: '成功',
    detail: ''
  });

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