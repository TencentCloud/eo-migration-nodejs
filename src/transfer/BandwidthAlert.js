const logger = require('../logger');

async function BandwidthAlert(self, zoneId, domain, domainConfig, report) {
  const keyConfig = domainConfig.BandwidthAlert;
  if (!keyConfig || !keyConfig.StatisticItems || keyConfig.StatisticItems.length === 0) {
    return null;
  }
  const { StatisticItems } = keyConfig;
  const fluxRules = StatisticItems.filter(rule => {
    return rule.Metric === 'flux';
  });
  const httpsRules = StatisticItems.filter(rule => {
    return rule.Metric === 'https';
  });
  if (fluxRules.length > 1 || httpsRules.length > 1) {
    report.Detail = `${report.Detail}检测到 CDN 存在多条封顶类型相同的规则，但 EO 相同封顶类型的规则，只能创建一条; `;
    logger.error('检测到 CDN 存在多条封顶类型相同的规则，但 EO 相同封顶类型的规则，只能创建一条');
    return null;
  }
  if (StatisticItems.find(rule => {
    return rule.Cycle === 43200;
  })) {
    report.Detail = `${report.Detail}EO 不支持周期为自然月的规则迁移; `;
    logger.error('EO 不支持周期为自然月的规则迁移');
    return null;
  }
  if (StatisticItems.find(rule => {
    return rule.Metric === 'bandwidth';
  })) {
    report.Detail = `${report.Detail}EO 不支持封顶类型为 带宽封顶; `;
    logger.error('EO 不支持封顶类型为 带宽封顶');
    return null;
  }

  for (rule of StatisticItems) {
    let param = {
      'ZoneId': zoneId,
      'Scope': 'domain_flow',
      'Domains': [domain],
      'CappingOperation': 'offline',
      'Action': 'CreateUsageCappingStrategy',
      'Period': rule.Cycle === 5 ? '5min' : rule.Cycle === 1440 ? 'day' : 'hour',
      'AlarmThreshold': rule.AlertPercentage,
    };
    if (rule.Metric === 'flux') {
      param['UsageType'] = 'flow';

      let threshold = rule.BpsThreshold;
      let unit = 'MB';
      if (threshold >= 1000000000000) {
        threshold = Math.floor(threshold / 1000000000000);
        unit = 'TB';
      }
      else if (threshold >= 1000000000) {
        threshold = Math.floor(threshold / 1000000000);
        unit = 'GB';
      }
      else {
        threshold = Math.floor(threshold / 1000000);
        unit = 'MC';
      }
      param['CappingThreshold'] = threshold;
      param['CappingUnit'] = unit;
    }
    else {
      let threshold = rule.BpsThreshold;
      let unit = '10_thousand_times';
      if (threshold >= 100000000) {
        threshold = Math.floor(threshold / 100000000);
        unit = '100_million_times';
      }
      else if (threshold >= 1000000) {
        threshold = Math.floor(threshold / 1000000);
        unit = '1_million_times';
      }
      else {
        threshold = Math.floor(threshold / 10000);
        unit = '10_thousand_times';
      }
      param['CappingThreshold'] = threshold;
      param['CappingUnit'] = unit;
    }

    try {
      const res = await self.API.eoClient['CreateUsageCappingStrategy'](param);
    }
    catch (e) {
      report.Detail = `${report.Detail} 用量封顶配置迁移失败：${e.toString()}; `;
      logger.error(e);
    }
  }

  return null;
}

module.exports = BandwidthAlert;