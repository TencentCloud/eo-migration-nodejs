function FollowRedirect(domain, domainConfig) {
  const keyConfig = domainConfig.FollowRedirect;
  if (!keyConfig || keyConfig.Switch !== 'on') {
    return null;
  }
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