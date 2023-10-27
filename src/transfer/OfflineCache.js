function OfflineCache(domain, domainConfig, ruleTransferLog) {
  const keyConfig = domainConfig.OfflineCache;
  if (keyConfig.Switch !== 'on') {
    ruleTransferLog.push({
      config: '离线缓存配置(OfflineCache)',
      result: '未配置',
      detail: ''
    });
    return null;
  }

  ruleTransferLog.push({
    config: '离线缓存配置(OfflineCache)',
    result: '成功',
    detail: ''
  });
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