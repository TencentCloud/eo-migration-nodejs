const logger = require('../logger');


function Compression(domain, domainConfig, ruleTransferLog) {
  const keyConfig = domainConfig.Compression;
  if (!keyConfig || !keyConfig.CompressionRules || !keyConfig.CompressionRules.length || keyConfig.Switch !== 'on') {
    ruleTransferLog.push({
      config: '智能压缩配置(Compression)',
      result: '未配置',
      detail: ''
    });
    return null;
  }
  const { CompressionRules } = keyConfig;

  if (CompressionRules.find(rule => {
    return rule.RuleType !== 'all';
  })) {
    ruleTransferLog.push({
      config: '智能压缩配置(Compression)',
      result: '失败',
      detail: `规则引擎中，智能压缩不支持按照文件后缀或 Content-Type 配置; `
    });
    logger.error('规则引擎中，智能压缩不支持按照文件后缀或 Content-Type 配置');
    return null;
  }
  ruleTransferLog.push({
    config: '智能压缩配置(Compression)',
    result: '成功',
    detail: ''
  });
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