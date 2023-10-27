function ErrorPage(domain, domainConfig, ruleTransferLog) {
  const keyConfig = domainConfig.ErrorPage;
  if (!keyConfig || !keyConfig.PageRules || !keyConfig.PageRules.length || keyConfig.Switch !== 'on') {
    ruleTransferLog.push({
      config: '自定义错误页面配置(ErrorPage)',
      result: '未配置',
      detail: ''
    });
    return null;
  }
  const { PageRules } = keyConfig;
  // 剔除公益404页面
  const filterPageRules = PageRules.filter(rule => {
    return rule.RedirectCode !== 404;
  });

  ruleTransferLog.push({
    config: '自定义错误页面配置(ErrorPage)',
    result: '成功',
    detail: ''
  });
  return {
    'CodeAction': {
      'Action': 'ErrorPage',
      'Parameters': filterPageRules.map(rule => {
        return {
          'StatusCode': rule.StatusCode,
          'Name': 'RedirectUrl',
          'Values': [rule.RedirectUrl]
        };
      })
    }
  };
}

module.exports = ErrorPage;
