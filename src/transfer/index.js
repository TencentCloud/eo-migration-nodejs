const StatusCodeCache = require('./StatusCodeCache');
const Compression = require('./Compression');
const RangeOriginPull = require('./RangeOriginPull');
const FollowRedirect = require('./FollowRedirect');
const ErrorPage = require('./ErrorPage');
const RequestHeader = require('./RequestHeader');
const ResponseHeader = require('./ResponseHeader');
const CacheKey = require('./CacheKey');
const Cache = require('./Cache');
const Authentication = require('./Authentication');
const ForceRedirect = require('./ForceRedirect');
const MaxAge = require('./MaxAge');
const UrlRedirect = require('./UrlRedirect');
const OfflineCache = require('./OfflineCache');
const PostMaxSize = require('./PostMaxSize');
const Quic = require('./Quic');
const WebSocket = require('./WebSocket');
const PathRules = require('./PathRules');
const PathBasedOrigin = require('./PathBasedOrigin');
const OriginPullProtocol = require('./OriginPullProtocol');
const Http2 = require('./Http2');
const OcspStapling = require('./OcspStapling');
const Hsts = require('./Hsts');
const TlsVersion = require('./TlsVersion');
const IpFilterRefererUserAgentFilter = require('./IpFilterRefererUserAgentFilter');
const BandwidthAlert = require('./BandwidthAlert');

const transfer = {
  ruleTransfer: {
    StatusCodeCache,
    Compression,
    RangeOriginPull,
    FollowRedirect,
    ErrorPage,
    RequestHeader,
    ResponseHeader,
    CacheKey,
    Cache,
    Authentication,
    ForceRedirect, // 待测试
    MaxAge,
    UrlRedirect,
    OfflineCache,
    PostMaxSize,
    Quic,  // 待测试
    WebSocket, // 待测试
    PathRules,
    PathBasedOrigin,
    OriginPullProtocol,
    Http2,
    OcspStapling,
    Hsts,
    TlsVersion,
  },
  otherTransfer: {
    IpFilterRefererUserAgentFilter,
    BandwidthAlert,
  }
};

module.exports = transfer;