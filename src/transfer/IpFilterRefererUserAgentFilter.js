const logger = require('../logger');

async function IpFilterRefererUserAgentFilter(self, zoneId, domain, domainConfig, report) {
  const ipFilter = domainConfig.IpFilter;
  const referer = domainConfig.Referer;
  const userAgentFilter = domainConfig.UserAgentFilter;
  let ipFilterFlag = true;
  let refererFlag = true;
  let userAgentFilterFlag = true;
  if (!ipFilter || !ipFilter.FilterRules || ipFilter.FilterRules.length === 0 || ipFilter.Switch === 'off') {
    ipFilterFlag = false;
  }
  if (!referer || !referer.RefererRules || referer.RefererRules.length === 0 || referer.Switch === 'off') {
    refererFlag = false;
  }
  if (!userAgentFilter || !userAgentFilter.FilterRules || userAgentFilter.FilterRules.length === 0 || userAgentFilter.Switch === 'off') {
    userAgentFilterFlag = false;
  }
  const ipFilterRules = ipFilter.FilterRules;
  const refererRules = referer.RefererRules;
  const userAgentFilterRules = userAgentFilter.FilterRules;
  if (ipFilterRules.find(rule => {
    return rule.RuleType !== 'all';
  })) {
    report.Detail = `${report.Detail}EO 不支持按目录配置 IP 黑白名单; `;
    logger.error('EO 不支持按目录配置 IP 黑白名单，本配置无法迁移');
    ipFilterFlag = false;
  }
  if (userAgentFilterRules.find(rule => {
    return rule.RuleType !== 'all';
  })) {
    report.Detail = `${report.Detail}EO 不支持按目录配置 UA 黑白名单; `;
    logger.error('EO 不支持按目录配置 UA 黑白名单，本配置无法迁移');
    userAgentFilterFlag = false;
  }
  let param = {
    'ZoneId': zoneId,
    'Entity': domain,
    'SecurityConfig': {
      'IpTableConfig': {
        'IpTableRules': [],
        'Switch': 'on'
      }
    }
  };

  if (ipFilterFlag) {
    ipFilterRules.forEach((rule, index) => {
      param.SecurityConfig.IpTableConfig.IpTableRules.push({
        'MatchFrom': 'ip',
        'MatchContent': rule.Filters.join(','),
        'Action': rule.FilterType === 'blacklist' ? 'drop' : 'trans',
        'Status': 'on',
        'Operator': 'match',
        'RuleName': `CDN迁移EO-IP黑白名单-${index}-${domain}`
      });
    });
  }

  if (refererFlag) {
    refererRules.forEach(rule => {
      param.SecurityConfig.IpTableConfig.IpTableRules.push({
        'MatchFrom': 'referer',
        'MatchContent': rule.Referers.join(','),
        'Action': rule.RefererType === 'blacklist' ? 'drop' : 'trans',
        'Status': 'on',
        'Operator': 'match',
        'RuleName': `CDN迁移EO-referer黑白名单-${domain}`
      });

      if (rule.AllowEmpty) {
        param.SecurityConfig.IpTableConfig.IpTableRules.push({
          'MatchFrom': 'referer',
          'Action': rule.RefererType === 'blacklist' ? 'drop' : 'trans',
          'Status': 'on',
          'Operator': 'is_empty',
          'MatchContent': '',
          'RuleName': `CDN迁移EO-referer黑白名单-空referer-${domain}`
        });
      }
    });
  }

  if (userAgentFilterFlag) {
    userAgentFilter.forEach((rule, index) => {
      param.SecurityConfig.IpTableConfig.IpTableRules.push({
        'MatchFrom': 'ua',
        'MatchContent': rule.UserAgents.join(','),
        'Action': rule.FilterType === 'blacklist' ? 'drop' : 'trans',
        'Status': 'on',
        'Operator': 'match',
        'RuleName': `CDN迁移EO-UA黑白名单-${index}-${domain}`
      });
    });
  }

  try {
    const res = await modify(self, param, 1);
    return res;
  }
  catch (e) {
    report.Detail = `${report.Detail}安全配置创建失败: ${e.toString()}; `;
    logger.error(e);
  }
}

async function modify(self, param, retryTimes) {
  let times = retryTimes + 1;
  try {
    const res = await self.API.eoClient['ModifySecurityPolicy'](param);
    return res;
  }
  catch (e) {
    if (times > 3) {
      throw e;
    }
    await wait(5000);
    return await modify(self, param, times);
  }
}


function wait(ms) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
};


module.exports = IpFilterRefererUserAgentFilter;