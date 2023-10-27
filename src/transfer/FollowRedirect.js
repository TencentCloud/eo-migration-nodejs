function FollowRedirect(domain, domainConfig, ruleTransferLog) {
  const keyConfig = domainConfig.FollowRedirect;
  if (!keyConfig || keyConfig.Switch !== 'on') {
    ruleTransferLog.push({
      config: '回源跟随301/302配置(FollowRedirect)',
      result: '未配置',
      detail: ''
    });
    return null;
  }
  ruleTransferLog.push({
    config: '回源跟随301/302配置(FollowRedirect)',
    result: '成功',
    detail: ''
  });
  return {
    'NormalAction': {
      'Action': 'UpstreamFollowRedirect',
      'Parameters': [
        {
          'Name': 'Switch',
          'Values': [
            'on'
          ]
        },
        {
          'Name': 'MaxTimes',
          'Values': [
            '3'
          ]
        }
      ]
    }
  };
}

module.exports = FollowRedirect;