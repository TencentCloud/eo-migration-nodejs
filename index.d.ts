/**
 * CDN配置迁移工具 类型声明
 */

declare namespace CDN2EO {
  interface Options {
    SecretId: string;   // 云API密钥ID
    SecretKey: string;  // 云API密钥KEY
  }

  interface TaskOptions {
    DomainZoneMaps: {
      Domains: string[];    // CDN 域名，必须跟站点对应，否则无法迁移，
      ZoneId: string;           // EO 站点唯一ID，
    }[];
    Configs?: string[];         // 想要迁移的配置，默认['IpFilter', 'StatusCodeCache', 'Compression', 'BandwidthAlert', 'RangeOriginPull', 'FollowRedirect', 'ErrorPage', 'RequestHeader', 'ResponseHeader', 'CacheKey', 'Cache', 'Authentication', 'ForceRedirect', 'Referer', 'MaxAge', 'UrlRedirect', 'UserAgentFilter', 'OfflineCache', 'PostMaxSize', 'Quic', 'WebSocket', 'OriginPullProtocol','ForceRedirect', 'Quic', 'Http2', 'OcspStapling', 'Hsts', 'TlsVersion']
    NeedCreateDomain?: boolean; // 是否需要创建域名，不传默认true，传false的话，只迁移配置，不创建域名
  }

}

declare class CDN2EO {

  constructor(options: CDN2EO.Options);

  static version: string;  // 版本号

  runTasks(params: TaskOptions): Promise;
}

export = CDN2EO;
