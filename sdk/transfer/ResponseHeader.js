function ResponseHeader(domain, domainConfig) {
  const keyConfig = domainConfig.ResponseHeader;
  if (!keyConfig || !keyConfig.HeaderRules || !keyConfig.HeaderRules.length || keyConfig.Switch !== 'on') {
    return null;
  }
  const { HeaderRules } = keyConfig;
  const eoRules = [];
  // 反向添加规则(CDN的规则优先级跟EO相反)
  HeaderRules.reverse().forEach(rule => {
    if (rule.HeaderMode === 'del') {
      eoRules.push({
        'Action': rule.HeaderMode,
        'Name': rule.HeaderName,
        'Values': []
      });
    }
    else {
      eoRules.push({
        'Action': rule.HeaderMode,
        'Name': rule.HeaderName,
        'Values': [rule.HeaderValue]
      });
    };
  });

  return {
    'RewriteAction': {
      'Action': 'ResponseHeader',
      'Parameters': eoRules
    }
  };
}

module.exports = ResponseHeader;