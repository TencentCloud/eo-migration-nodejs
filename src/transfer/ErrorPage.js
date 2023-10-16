function ErrorPage(domain, domainConfig) {
  const keyConfig = domainConfig.ErrorPage;
  if (!keyConfig || !keyConfig.PageRules || !keyConfig.PageRules.length || keyConfig.Switch !== 'on') {
    return null;
  }
  const { PageRules } = keyConfig;
  // 剔除公益404页面
  const filterPageRules = PageRules.filter(rule => {
    return rule.RedirectCode !== 404;
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
