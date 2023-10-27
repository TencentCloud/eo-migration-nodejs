
function ForceRedirect(domain, domainConfig, ruleTransferLog) {
  const keyConfig = domainConfig.ForceRedirect;
  if (!keyConfig || keyConfig.Switch !== 'on') {
    ruleTransferLog.push({
      config: '强制跳转(ForceRedirect)',
      result: '未配置',
      detail: ''
    });
    return null;
  }

  ruleTransferLog.push({
    config: '强制跳转(ForceRedirect)',
    result: '成功',
    detail: ''
  });

  return {
    'NormalAction': {
      'Action': 'ForceRedirect',
      'Parameters': [
        {
          'Name': 'Switch',
          'Values': [
            'on'
          ]
        },
        {
          'Name': 'RedirectStatusCode',
          'Values': [String(keyConfig.RedirectStatusCode)]
        }
      ]
    }
  };

}

module.exports = ForceRedirect;