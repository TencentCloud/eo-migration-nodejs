function Quic(domain, domainConfig, ruleTransferLog) {
  const keyConfig = domainConfig.Quic;
  if (keyConfig.Switch !== 'on') {
    ruleTransferLog.push({
      config: 'Quic配置(Quic)',
      result: '未配置',
      detail: ''
    });
    return null;
  }

  ruleTransferLog.push({
    config: 'Quic配置(Quic)',
    result: '成功',
    detail: ''
  });

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