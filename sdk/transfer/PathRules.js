
function PathRules(domain, domainConfig) {
  const keyConfig = domainConfig.Origin.PathRules;
  if (!keyConfig || !keyConfig.length) {
    return null;
  }
  const eoRules = [];

  keyConfig.reverse().forEach(rule => {
    eoRules.push({
      'Conditions': [
        {
          'Conditions': [
            {
              'Operator': 'equal',
              'Target': rule.FullMatch ? 'full_url' : 'url',
              'IgnoreCase': false,
              'Values': [rule.Path]
            }
          ]
        }
      ],
      'Actions': [
        {
          'NormalAction': {
            'Action': 'UpstreamUrlRedirect',
            'Parameters': [
              {
                'Name': 'Type',
                'Values': [
                  'Path'
                ]
              },
              {
                'Name': 'Action',
                'Values': [
                  'replace'
                ]
              },
              {
                'Name': 'Value',
                'Values': [rule.ForwardUri]
              }
            ]
          }
        }
      ]
    });
  });

  return {
    'Rules': eoRules,
    'Tags': []
  };
}

module.exports = PathRules;