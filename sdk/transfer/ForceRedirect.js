
function ForceRedirect(domain, domainConfig) {
  const keyConfig = domainConfig.ForceRedirect;
  if (!keyConfig || keyConfig.Switch !== 'on') {
    return null;
  }

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