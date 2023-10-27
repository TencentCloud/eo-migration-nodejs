const _ = require('lodash');
const utils = require('./utils');
const transfer = require('./transfer');
const logger = require('./logger');
const ObjectsToCsv = require('objects-to-csv');
const Aegis = require('aegis-node-sdk');


// 新版源站组接口未上线，暂时屏蔽后两个配置
const defaultConfigs = ['IpFilter', 'StatusCodeCache', 'Compression', 'BandwidthAlert', 'RangeOriginPull', 'FollowRedirect', 'ErrorPage', 'RequestHeader', 'ResponseHeader', 'CacheKey', 'Cache', 'Authentication', 'ForceRedirect', 'Referer', 'MaxAge', 'UrlRedirect', 'UserAgentFilter', 'OfflineCache', 'PostMaxSize', 'Quic', 'WebSocket', 'PathBasedOrigin', 'PathRules'];
const ruleConfigs = ['StatusCodeCache', 'Compression', 'RangeOriginPull', 'FollowRedirect', 'ErrorPage', 'RequestHeader', 'ResponseHeader', 'CacheKey', 'Cache', 'Authentication', 'MaxAge', 'UrlRedirect', 'OfflineCache', 'PostMaxSize', 'WebSocket', 'PathBasedOrigin', 'PathRules'];
const otherConfigs = ['IpFilterRefererUserAgentFilter', 'BandwidthAlert'];

const httpsConfigs = ['ForceRedirect', 'Quic', 'Http2', 'OcspStapling', 'Hsts', 'TlsVersion'];

/**
 * 任务入参
 * @param  {Object}  options    
 *     @param  {Array}  options.DomainZoneMaps                          CDN域名跟EO站点的映射关系数组，必须
 *         @param  {Array}  options.DomainZoneMaps[i].Domains       CDN域名，可批量传入，要求跟站点匹配，必须
 *         @param  {String}  options.DomainZoneMaps[i].ZoneId           EO站点唯一ID，必须
 *     @param  {Array}  options.Configs                                 指定要迁移的配置，默认值见readme说明，非必须
 *     @param  {Boolean}  options.NeedCreateDomain                      是否需要创建域名，不传默认true，传false的话，只迁移配置，不创建域名，非必须
 */
async function runTasks(options) {
  const reportDatas = [];
  const aegis = new Aegis({
    id: 'lJ7dDFybL1wqa79Po5', // 项目上报ID
  });

  try {
    const self = this;
    const domainMaps = options.DomainZoneMaps;
    const needCreateDomain = options.NeedCreateDomain === undefined ? true : options.NeedCreateDomain;


    let needConfigsKeys = (options.Configs && options.Configs.length > 0) ? options.Configs.filter(config => {
      return defaultConfigs.includes(config);
    }) : defaultConfigs;
    if (needConfigsKeys.length === 0) {
      needConfigsKeys = defaultConfigs;
    }

    if (!domainMaps || domainMaps.length === 0) {
      throw new Error(`参数 DomainZoneMaps 不存在或为空数组`);
    }
    const tasks = [];
    domainMaps.forEach(map => {
      if (!map.Domains || !map.Domains.length || map.Domains.length === 0 || !map.ZoneId) {
        return;
      }
      map.Domains.forEach(domain => {
        tasks.push({
          domain,
          zoneId: map.ZoneId,
        });
      });
    });

    if (tasks.length === 0) {
      throw new Error(`不存在有效的任务，请检查参数`);
    }


    logger.info(`待迁移的任务数：${tasks.length}`);

    for (task of tasks) {
      const report = {
        Domain: task.domain,
        ZoneId: task.zoneId,
        Details: []
      };
      logger.info(`开始任务，Domain: ${task.domain || null}, ZoneId: ${task.zoneId || null}`);
      const res = await singleTask(self, task.domain, task.zoneId, needConfigsKeys, report, needCreateDomain);

      try {
        // 日志上报
        aegis.info(report);
      }
      catch (e) {
        logger.error(e);
      }

      report.Details.forEach(log => {
        reportDatas.push({
          '域名': report.Domain,
          '站点ID': report.ZoneId,
          '配置项': log.config,
          '迁移结果': log.result,
          '详情': log.detail,
        });
      });

      // 一个域名空一行
      reportDatas.push({
        '域名': '',
        '站点ID': '',
        '配置项': '',
        '迁移结果': '',
        '详情': '',
      });
    }

    logger.success(`所有任务迁移完成`);

    const csv = new ObjectsToCsv(reportDatas);
    await csv.toDisk(`./report-${new Date().getTime()}.csv`);
    logger.success(`已生成迁移报告`);
  }
  catch (e) {
    logger.error(e);
  }
}

/**
 * 任务入参
 * @param  {Object}  options    
 *     @param  {Array}  options.DomainZoneMaps                          CDN域名跟EO站点的映射关系数组，必须
 *         @param  {Array}  options.DomainZoneMaps[i].Domains       CDN域名唯一ID，可批量传入，要求跟站点匹配，必须
 *         @param  {String}  options.DomainZoneMaps[i].ZoneId           EO站点唯一ID，必须
 *     @param  {Array}  options.Configs                                 指定要迁移的配置，默认值见readme说明，非必须
 */
async function runScdnTasks(options) {
  const reportDatas = [];

  try {
    const self = this;
    const domainMaps = options.DomainZoneMaps;


    let needConfigsKeys = (options.Configs && options.Configs.length > 0) ? options.Configs.filter(config => {
      return defaultConfigs.includes(config);
    }) : defaultConfigs;
    if (needConfigsKeys.length === 0) {
      needConfigsKeys = defaultConfigs;
    }

    if (!domainMaps || domainMaps.length === 0) {
      throw new Error(`参数 DomainZoneMaps 不存在或为空数组`);
    }
    const tasks = [];
    domainMaps.forEach(map => {
      if (!map.Domains || !map.Domains.length || map.Domains.length === 0 || !map.ZoneId) {
        return;
      }
      map.Domains.forEach(domain => {
        tasks.push({
          domain,
          zoneId: map.ZoneId,
        });
      });
    });

    if (tasks.length === 0) {
      throw new Error(`不存在有效的任务，请检查参数`);
    }


    logger.info(`待迁移的任务数：${tasks.length}`);

    for (task of tasks) {
      const report = {
        Domain: task.domain,
        ZoneId: task.zoneId,
        Details: []
      };
      logger.info(`开始任务，ResourceId: ${task.domain || null}, ZoneId: ${task.zoneId || null}`);
      const res = await singleScdnTask(self, task.domain, task.zoneId, needConfigsKeys, report);

      reportDatas.push(report);
    }

    logger.success(`所有任务迁移完成`);

    const csv = new ObjectsToCsv(reportDatas);
    await csv.toDisk(`./report-scdn-${new Date().getTime()}.csv`);
    logger.success(`已生成迁移报告`);
  }
  catch (e) {
    logger.error(e);
  }
}

async function singleTask(self, domain, zoneId, needConfigsKeys, report, needCreateDomain) {
  if (!domain) {
    logger.error(`参数 Domain 为空，跳过任务`);
    report.Details.push({
      config: '所有配置',
      result: '失败',
      detail: `参数 Domain 为空，跳过任务`
    });
    return;
  }
  if (!zoneId) {
    logger.error(`参数 ZoneId 为空，跳过任务`);
    report.Details.push({
      config: '所有配置',
      result: '失败',
      detail: `参数 ZoneId 为空，跳过任务`
    });
    return;
  }

  logger.info(`获取 CDN 域名配置...`);
  try {
    const { Domains: [domainConfig] } = await self.API.cdnClient['DescribeDomainsConfig']({
      Filters: [
        {
          'Name': 'domain',
          'Value': [
            domain
          ]
        }
      ]
    });

    if (!domainConfig) {
      throw new Error(`Domain: ${domain} 对应的域名不存在，跳过任务`);
    }

    logger.success(`配置获取成功`);

    // EO创建域名
    const domainName = domainConfig.Domain;
    const origins = domainConfig.Origin.Origins;
    const originType = domainConfig.Origin.OriginType;
    let groupId = '';
    let originPort = null;

    let originInfo = {
      HostHeader: domainConfig.Origin.ServerName
    };
    if (needCreateDomain) {
      if (originType === 'cos') {
        originInfo['OriginType'] = 'COS';
        originInfo['PrivateAccess'] = domainConfig.Origin.CosPrivateAccess;
        originInfo['Origin'] = origins[0];
      }
      else if (['domain', 'domainv6', 'ip', 'ipv6'].includes(originType)) {
        if (origins.length > 1 || utils.testIpAndWeight(origins[0]) || utils.testIpAndPortAndWeight(origins[0]) || utils.testDomainAndWeight(origins[0]) || utils.testDomainAndPortAndWeight(origins[0])) {
          const validResult = utils.validateOriginsPort(origins);

          if (!validResult[0]) {
            throw new Error(validResult[1]);
          }
          originPort = validResult[1];

          groupId = await createOriginGroup(self, {
            zoneId,
            origins: origins,
            name: `CDN迁移EO-源站组-${domainName}`
          });
          originInfo['OriginType'] = 'ORIGIN_GROUP';
          originInfo['Origin'] = groupId;
        }
        else {
          const [ip, port] = origins[0].split(':');
          originInfo['OriginType'] = 'IP_DOMAIN';
          originInfo['Origin'] = ip;
          if (port) {
            originPort = port;
          }
        }
      }
      else if (['third_party'].includes(originType) && domainConfig.Origin.OriginCompany === 'aws_s3') {
        originInfo['OriginType'] = 'IP_DOMAIN';
        originInfo['Origin'] = origins[0];
        originInfo['PrivateAccess'] = domainConfig.AwsPrivateAccess && domainConfig.AwsPrivateAccess.Switch ? domainConfig.AwsPrivateAccess.Switch : 'off';
        if (originInfo['PrivateAccess'] === 'off') {
          originInfo['PrivateParameters'] = [
            {
              'Name': 'AccessKeyId',
              'Value': ''
            },
            {
              'Name': 'SecretAccessKey',
              'Value': ''
            },
            {
              'Name': 'SignatureVersion',
              'Value': 'v4'
            },
            {
              'Name': 'Region',
              'Value': ''
            }
          ];
        }
        else {
          originInfo['PrivateParameters'] = [
            {
              'Name': 'AccessKeyId',
              'Value': domainConfig.AwsPrivateAccess.AccessKey
            },
            {
              'Name': 'SecretAccessKey',
              'Value': domainConfig.AwsPrivateAccess.SecretKey
            },
            {
              'Name': 'SignatureVersion',
              'Value': domainConfig.AwsPrivateAccess.Bucket
            },
            {
              'Name': 'Region',
              'Value': domainConfig.AwsPrivateAccess.Region
            }
          ];
        }
      }
      else {
        throw new Error(`暂不支持该源站类型的域名迁移`);
      }
    }

    if (needCreateDomain) {
      logger.info(`调用 CreateAccelerationDomain 创建 EO 域名...`);
      const param = {
        ZoneId: zoneId,
        DomainName: domainName,
        OriginInfo: originInfo,
      };
      if (domainConfig.Origin.OriginPullProtocol) {
        param['OriginProtocol'] = domainConfig.Origin.OriginPullProtocol.toUpperCase();
      }
      if (originPort) {
        param['HttpOriginPort'] = originPort;
        param['HttpsOriginPort'] = originPort;
      }
      const createAccelerationDomainRes = await self.API.eoClient['CreateAccelerationDomain'](param);

      logger.success(`域名创建成功`);
    }

    // 分类配置，EO的配置主要分三部分接口组成，1.添加域名时源站配置，2.规则引擎配置，3.安全/用量封顶等其他配置
    // 规则引擎配置
    let ruleConfigKeys = needConfigsKeys.filter((key) => {
      return ruleConfigs.includes(key);
    });

    // 判断是否需要迁移证书配置
    if (domainConfig.Https && domainConfig.Https.Switch === 'on' && domainConfig.Https.CertInfo && domainConfig.Https.CertInfo.CertId) {
      const expireTime = new Date(domainConfig.Https.CertInfo.ExpireTime.replace(/-/g, '/')).getTime();
      const now = new Date().getTime();
      if (expireTime > now) {
        logger.error('证书已过期，无法迁移 HTTPS 相关配置');
        report.Details.push({
          config: 'HTTPS配置(Https)',
          result: '失败',
          detail: '证书已过期，无法迁移 HTTPS 相关配置'
        });
      }
      else {
        // 获取ssl 证书列表
        try {
          const { TotalCount, Certificates } = await self.API.sslClient['DescribeCertificates']({
            Offset: 0,
            Limit: 1000,
            SearchKey: domainConfig.Https.CertInfo.CertId,
          });
          if (TotalCount === 0) {
            throw new Error(`获取不到相关证书信息，，无法迁移 HTTPS 相关配置`);
          }
          // 创建证书配置
          const certRes = await self.API.eoClient['ModifyHostsCertificate']({
            ZoneId: zoneId,
            Hosts: [domainName],
            ServerCertInfo: [{
              CertId: domainConfig.Https.CertInfo.CertId
            }]
          });

          // 证书创建完毕后，把证书相关配置加入到规则引擎中
          ruleConfigKeys = [].concat(ruleConfigKeys, httpsConfigs);
        }
        catch (e) {
          report.Details.push({
            config: 'HTTPS配置(Https)',
            result: '失败',
            detail: `${e.toString()}`
          });
          logger.error(e);
        }
      }
    }
    else {
      report.Details.push({
        config: 'HTTPS配置(Https)',
        result: '未配置',
        detail: ''
      });
    }

    const cdnRuleConfigs = {};
    const eoRuleConfigs = {};


    logger.info(`迁移 CDN 配置到规则引擎...`);
    // CDN配置转成规则引擎配置
    if (ruleConfigKeys.length > 0) {
      // 记录每个配置转成规则的日志
      let ruleTransferLog = [];
      ruleConfigKeys.forEach(key => {
        cdnRuleConfigs[key] = domainConfig[key];
        eoRuleConfigs[key] = transfer.ruleTransfer[key](domainName, domainConfig, ruleTransferLog);
      });
      // 规则引擎配置拼接
      const rules = utils.rulesGenerator(domainName, eoRuleConfigs);
      logger.info(JSON.stringify(rules));
      // 创建规则
      try {
        const createRuleRes = await self.API.eoClient['CreateRule']({
          ZoneId: zoneId,
          RuleName: `[CDN迁移EO] ${domainName}`,
          Status: 'enable',
          Rules: rules,
        });

        // 规则创建成功，则将日志写到报告里
        report.Details = report.Details.concat(ruleTransferLog);
        logger.success(`规则创建成功`);

      } catch (e) {
        report.Details.push({
          config: '规则引擎相关配置',
          result: '失败',
          detail: `${e.toString()}`
        });
        logger.error(e);
      }
    }
    else {
      logger.warn(`无可迁移配置，跳过步骤`);
    }

    logger.success(`${domainName} 迁移完成`);
  }
  catch (e) {
    report.Details.push({
      config: '所有配置',
      result: '失败',
      detail: `${e.toString()}`
    });
    logger.error(e);
  }
}

async function singleScdnTask(self, domain, zoneId, needConfigsKeys, report) {
  if (!domain) {
    logger.error(`参数 Domain 为空，跳过任务`);
  }
  if (!zoneId) {
    logger.error(`参数 ZoneId 为空，跳过任务`);
  }

  logger.info(`获取 CDN 域名配置...`);
  try {
    const { Domains: [domainConfig] } = await self.API.cdnClient['DescribeDomainsConfig']({
      Filters: [
        {
          'Name': 'domain',
          'Value': [
            domain
          ]
        }
      ]
    });

    if (!domainConfig) {
      throw new Error(`Domain: ${domain} 对应的域名不存在，跳过任务`);
    }

    logger.success(`配置获取成功`);

    const domainName = domainConfig.Domain;
    logger.info(`迁移 CDN 配置到安全防护...`);
    // 创建其他配置
    // 创建IpFilter,RefererUser,AgentFilter配置
    // 安全配置需要等域名部署完才能创建，后面增加接口改为异步创建
    try {
      await transfer.otherTransfer['IpFilterRefererUserAgentFilter'](self, zoneId, domainName, domainConfig, report);
      logger.success(`迁移成功`);
    } catch (e) {
      report.Details = `${report.Details}安全配置创建失败: ${e.toString()}; `;
      logger.error(e);
    }
    // 创建IBandwidthAlert配置，CreateUsageCappingStrategy接口未更新到云API的SDK，暂时屏蔽
    // await transfer.otherTransfer['BandwidthAlert'](self, zoneId, domainName, domainConfig);
    logger.success(`${domainName} 迁移完成`);
  }
  catch (e) {
    report.Details = `域名迁移失败: ${e.toString()}`;
    logger.error(e);
  }
}

async function createOriginGroup(self, params) {
  const { zoneId, origins, name } = params;
  const records = [];
  origins.forEach(origin => {
    const [ipDomain, port, weight] = origin.split(':');
    let record = {
      Record: ipDomain,
      Type: 'IP_DOMAIN',
      Weight: Number(weight)
    };
    if (weight === '' || weight === undefined) {
      delete record.Weight;
    }
    records.push(record);
  });

  const { OriginGroupId } = await self.API.eoClient['CreateOriginGroup']({
    ZoneId: zoneId,
    Name: name,
    Type: 'GENERAL',
    Records: records,
  });
  return OriginGroupId;
}

const API_MAP = {
  runTasks: runTasks,
  runScdnTasks: runScdnTasks,
};

module.exports.init = function (CDN2EO, task) {
  _.each(API_MAP, function (fn, apiName) {
    CDN2EO.prototype[apiName] = fn;
  });
};
