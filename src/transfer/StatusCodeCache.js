function StatusCodeCache(domain, domainConfig, ruleTransferLog) {
  const keyConfig = domainConfig.StatusCodeCache;
  if (!keyConfig || !keyConfig.CacheRules || !keyConfig.CacheRules.length || keyConfig.Switch !== 'on') {
    ruleTransferLog.push({
      config: '状态码缓存配置(StatusCodeCache)',
      result: '未配置',
      detail: ''
    });
    return null;
  }
  const { CacheRules } = keyConfig;
  ruleTransferLog.push({
    config: '状态码缓存配置(StatusCodeCache)',
    result: '成功',
    detail: ''
  });
  return {
    'CodeAction': {
      'Action': 'StatusCodeCache',
      'Parameters': CacheRules.map(rule => {
        return {
          Name: 'CacheTime',
          StatusCode: Number(rule.StatusCode),
          Values: [
            String(rule.CacheTime)
          ]
        };
      })
    }
  };
}

module.exports = StatusCodeCache

