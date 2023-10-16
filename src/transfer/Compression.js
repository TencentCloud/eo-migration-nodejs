const logger = require('../logger');


function Compression(domain, domainConfig, report) {
  const keyConfig = domainConfig.Compression;
  if (!keyConfig || !keyConfig.CompressionRules || !keyConfig.CompressionRules.length || keyConfig.Switch !== 'on') {
    return null;
  }
  const { CompressionRules } = keyConfig;

  if (CompressionRules.find(rule => {
    return rule.RuleType !== 'all';
  })) {
    report.Detail = `${report.Detail}规则引擎中，智能压缩不支持按照文件后缀或 Content-Type 配置; `;
    logger.error('规则引擎中，智能压缩不支持按照文件后缀或 Content-Type 配置');
    return null;
  }
  return {
    'Rules': [{
      'Conditions': [
        {
          'Conditions': [
            {
              'Operator': 'equal',
              'Target': 'host',
              'Values': [
                'all'
              ]
            }
          ]
        }
      ],
      'Actions': [
        {
          'NormalAction': {
            'Action': 'Compression',
            'Parameters': [
              {
                'Name': 'Switch',
                'Values': [
                  'on'
                ]
              },
              {
                'Name': 'Algorithms',
                'Values': CompressionRules[0].Algorithms
              }
            ]
          }
        }
      ]
    }]
  };
}

module.exports = Compression;