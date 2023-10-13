function PostMaxSize(domain, domainConfig) {
  const keyConfig = domainConfig.PostMaxSize;
  if (keyConfig.Switch !== 'on') {
    return null;
  }

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