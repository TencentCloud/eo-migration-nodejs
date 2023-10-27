function PostMaxSize(domain, domainConfig, ruleTransferLog) {
  const keyConfig = domainConfig.PostMaxSize;
  if (keyConfig.Switch !== 'on') {
    ruleTransferLog.push({
      config: 'POST请求大小配置(PostMaxSize)',
      result: '未配置',
      detail: ''
    });
    return null;
  }

  ruleTransferLog.push({
    config: 'POST请求大小配置(PostMaxSize)',
    result: '成功',
    detail: ''
  });

  return {
    'NormalAction': {
      'Action': 'PostMaxSize',
      'Parameters': [
        {
          'Name': 'Switch',
          'Values': [
            'on'
          ]
        },
        {
          'Name': 'MaxSize',
          'Values': [String(keyConfig.MaxSize)]
        }
      ]
    }
  };
}

module.exports = PostMaxSize;