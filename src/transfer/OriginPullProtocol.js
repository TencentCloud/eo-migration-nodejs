
function OriginPullProtocol(domain, domainConfig, ruleTransferLog) {
  const keyConfig = domainConfig.Origin.OriginPullProtocol;
  if (!keyConfig) {
    ruleTransferLog.push({
      config: '回源协议配置(Origin.OriginPullProtocol)',
      result: '未配置',
      detail: ''
    });
    return null;
  }

  ruleTransferLog.push({
    config: '回源协议配置(Origin.OriginPullProtocol)',
    result: '成功',
    detail: ''
  });

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