function ResponseHeader(domain, domainConfig, ruleTransferLog) {
  const keyConfig = domainConfig.ResponseHeader;
  if (!keyConfig || !keyConfig.HeaderRules || !keyConfig.HeaderRules.length || keyConfig.Switch !== 'on') {
    ruleTransferLog.push({
      config: 'HTTP响应头配置(ResponseHeader)',
      result: '未配置',
      detail: ''
    });

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
  ruleTransferLog.push({
    config: 'HTTP响应头配置(ResponseHeader)',
    result: '成功',
    detail: ''
  });

  return {
    'RewriteAction': {
      'Action': 'ResponseHeader',
      'Parameters': eoRules
    }
  };
}

module.exports = ResponseHeader;