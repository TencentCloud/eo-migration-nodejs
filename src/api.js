const tencentcloud = require('tencentcloud-sdk-nodejs');

const CdnClient = tencentcloud.cdn.v20180606.Client;
const EoClient = tencentcloud.teo.v20220901.Client;
const SslClient = tencentcloud.ssl.v20191205.Client;

const API = function (secretId, secretKey) {
  const cdnClient = new CdnClient({
    credential: {
      secretId: secretId,
      secretKey: secretKey,
    },
    // 产品地域
    region: 'ap-guangzhou',
    // 可选配置实例
    profile: {
      signMethod: 'TC3-HMAC-SHA256',
      httpProfile: {
        reqMethod: 'POST',
        reqTimeout: 30,
      },
    },
  });

  const eoClient = new EoClient({
    credential: {
      secretId: secretId,
      secretKey: secretKey,
    },
    // 产品地域
    region: 'ap-shanghai',
    // 可选配置实例
    profile: {
      signMethod: 'TC3-HMAC-SHA256',
      httpProfile: {
        reqMethod: 'POST',
        reqTimeout: 30,
      },
    },
  });

  const sslClient = new SslClient({
    credential: {
      secretId: secretId,
      secretKey: secretKey,
    },
    // 产品地域
    region: 'ap-shanghai',
    // 可选配置实例
    profile: {
      signMethod: 'TC3-HMAC-SHA256',
      httpProfile: {
        reqMethod: 'POST',
        reqTimeout: 30,
      },
    },
  });

  this.cdnClient = cdnClient;
  this.eoClient = eoClient;
  this.sslClient = sslClient;
};

module.exports = API;
