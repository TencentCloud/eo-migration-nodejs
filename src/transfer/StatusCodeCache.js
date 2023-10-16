function StatusCodeCache(domain, domainConfig) {
  const keyConfig = domainConfig.StatusCodeCache;
  if (!keyConfig || !keyConfig.CacheRules || !keyConfig.CacheRules.length || keyConfig.Switch !== 'on') {
    return null;
  }
  const { CacheRules } = keyConfig;
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

