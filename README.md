# 简介
**cdn** 域名批量迁移工具，协助用户把 **cdn** 域名配置迁移到 **edgeone**

# 依赖环境
1.NODEJS 10.0.0 版本及以上

2.获取云API密钥 SecretId，SecretKey，可以上控制台创建：https://console.cloud.tencent.com/cam/capi

3.edgeone 已经创建好对应站点，edgeone控制台：https://console.cloud.tencent.com/edgeone

# 使用指南

## 1.安装 nodejs
- [nodejs 下载地址](https://nodejs.org/en)，建议下载稳定版

- 安装完毕之后，打开命令行工具：

- 检查node安装情况，输入指令：node -v，如下所示，返回版本号，则说明安装成功

``` 
$ node -v
v14.21.1
```

- 检查npm安装情况，输入指令：npm -v，如下所示，返回版本号，则说明安装成功

``` 
$ npm -v
9.6.7
```
## 2.下载本仓库包
可以通过 git clone https://github.com/TencentCloud/tencentcloud-sdk-nodejs.git 下载，或直接下载压缩包后解压
## 3.安装三方依赖
进入本工程文件目录 /tencentcloud-sdk-nodejs，执行指令
``` 
$ npm install
```
## 4.修改配置
- 进入文件夹 /example
- 修改配置文件 config.json
- 修改 SecretId，SecretKey为用户的云API密钥，可以上控制台查询：https://console.cloud.tencent.com/cam/capi
- 填写ResourceIds，数组格式，为CDN待迁移域名的唯一ID，可以上控制台查询：https://console.cloud.tencent.com/cdn/domains
	- 进入控制台页面，点击管理，进入详情页，https://console.cloud.tencent.com/cdn/domains/xxx，此时浏览器URL最后一段xxx，为域名的唯一ID，使用此ID即可
- 填写ZoneId，字符串格式，详情可以上控制台查询：https://console.cloud.tencent.com/edgeone/zones

配置实例：
``` 
{
  "SecretId": "xxx",
  "SecretKey": "xxx",
  "List": [
    {
      "ResourceIds": [
        "cdn-6lelzmtm",
        "cdn-qo23xb86"
      ],
      "ZoneId": "zone-29jdhcbg1mea"
    }
  ],
  "NeedCreateDomain": true
}
```

**重要提醒：使用此工具前，需要先在edgeone控制台上创建好对应的站点，否则无法迁移，此工具无法创建站点，只能在站点下创建域名**

## 5.执行指令
``` 
$ node task.js
```
**task.js 在 /example 目录，跟 config.json 同一目录，如果离开本目录执行指令，请修改相对路径**

## 6.查看迁移报告
脚本运行完毕后，本地目录会生成一个csv文件（report-${timespamp}.csv），记录了运行中遇到的错误

# 支持迁移的配置及注意事项
| 源站相关配置 | Key | 备注 |
| :-----| ----: | :----: |
| 源站 | Origin.Origins | <font color=red>暂时只支持单IP或域名源站，不支持端口跟权重</font>  |
| 源站类型 | Origin.OriginType | <font color=red>只支持IP\域名\COS</font> |
| Host Header | Origin.ServerName | - |
| 私有访问 | Origin.CosPrivateAccess | - |


| 规则引擎相关配置 | Key | 备注 |
| :-----| ----: | :----: |
| 状态码缓存 | StatusCodeCache | - |
| 智能压缩 | Compression | <font color=red>不支持按照文件后缀或 Content-Type 配置</font> |
| 分片回源 | RangeOriginPull | - |
| 回源跟随301/302 | FollowRedirect | - |
| 自定义错误页面 | ErrorPage | - |
| 回源HTTP请求头 | RequestHeader | - |
| HTTP响应头 | ResponseHeader | - |
| 缓存键规则 | CacheKey | - |
| 节点缓存 | Cache | - |
| 鉴权 | Authentication | - |
| 浏览器缓存 | MaxAge | - |
| 访问URL重写 | UrlRedirect | - |
| 离线缓存 | OfflineCache | - |
| POST请求大小 | PostMaxSize | - |
| WebSocket | WebSocket | - |
| HTTPS | Https | <font color=red>只支持托管证书，自上传证书配置无法迁移</font> |
| 强制跳转 | ForceRedirect | <font color=red>依赖HTTPS配置</font> |
| HTTP 2.0 | Http2 | <font color=red>依赖HTTPS配置</font> |
| Quic | Quic | <font color=red>依赖HTTPS配置</font> |
| OCSP装订 | OcspStapling | <font color=red>依赖HTTPS配置</font> |
| HSTS | Hsts | <font color=red>依赖HTTPS配置</font> |
| TLS版本 | TlsVersion | <font color=red>依赖HTTPS配置</font> |


<!-- | 安全防护相关配置 | Key | 备注 |
| :-----| ----: | :----: |
| IP黑白名单 | IpFilter | <font color=red>EO 不支持按目录配置</font> |
| UA黑白名单 | UserAgentFilter | <font color=red>EO 不支持按目录配置</font> |
| 防盗链 | Referer | - | -->