# 概述
本工具支持将腾讯云内容分发网络 CDN 服务内已接入的域名配置批量迁移至腾讯云边缘安全加速平台 EO 服务内，支持包括 CDN/ECDN/SCDN 域名。

# 前提条件
1. 已安装 Nodejs 10.0.0 版本及以上
2. 已在腾讯云控制台内创建云 API 秘钥，获取相应的 SecretId、SecretKey。可前往[云 API 控制台](https://console.cloud.tencent.com/cam/capi)内获取。
3. 参考 [从零开始快速接入](https://cloud.tencent.com/document/product/1552/87601) EdgeOne 创建完成需迁移的域名站点。

# 使用指南

## 场景示例
当前在腾讯云 CDN 内已接入加速域名 www.example.com、test.example.com 和 vod.example.com，在腾讯云 EdgeOne 服务内已创建站点 example.com，计划将 CDN 内的这三个域名服务及相关配置迁移到 EdgeOne 控制台内的对应站点下。

## 操作步骤

### 步骤1：安装依赖环境及配置迁移工具
1. 安装 [nodejs](https://nodejs.org/en)，建议下载并安装18.18.2版本。
2. 安装完毕之后，打开命令行工具；
3. 执行指令：node -v，用于检查node安装情况，如下所示，返回版本号，则说明安装成功
```
$ node -v
v18.18.2
```
4. 执行指令：npm -v，检查 npm 安装情况，如下所示，返回版本号，则说明安装成功
```
$ npm -v
v9.6.7
```
5. 执行指令：npm install tencentcloud-edgeone-migration-nodejs，下载并安装本工具包
```
npm install tencentcloud-edgeone-migration-nodejs
```
6. 执行指令：cd ./node_modules/tencentcloud-edgeone-migration-nodejs，进入工具安装目录
```
$ cd ./node_modules/tencentcloud-edgeone-migration-nodejs 
```

### 步骤2：迁移配置
1. 安装完成后，在文件的安装根目录下，可以找到配置文件 config.json，打开改配置文件并修改相关迁移配置，各参数配置说明如下：
  - SecretId，SecretKey：为当前需迁移的腾讯云账号云API密钥，可以上控制台查询：https://console.cloud.tencent.com/cam/capi
  - Domains：数组格式，为CDN待迁移域名，可以上控制台查询：https://console.cloud.tencent.com/cdn/domains
  - ZoneId：字符串格式，详情可以上控制台查询：https://console.cloud.tencent.com/edgeone/zones
  - NeedCreateDomain：布尔值，是否需要创建域名，默认为 true，传 false 则只迁移配置，不创建域名，便于多次操作同一个域名
  - 配置示例：
```
{
  "SecretId": "xxx",
  "SecretKey": "xxx",  
  "List": [{
    "Domains": [ 
      "1.test.com", 
      "2.test.com" 
    ],
    "ZoneId": "xxx"
  }], 
  "NeedCreateDomain": true
}
```

> **说明：**
> 
> 使用此工具前，需要现在EdgeOne控制台上创建好对应的站点，否则无法迁移，此工具无法创建站点，只能在站点下创建域名。
> 

2. 执行指令，开始进行配置迁移。

``` bash
$ node task.js
```   

> **注意：**
> 
> task.js 文件需要跟 config.json 在同一目录下，如果离开本目录执行指令，请修改相对路径。
> 


#### 步骤3：迁移后验证

> **说明：**
> 
> 使用本工具完成域名迁移后，请人工进行验证配置项是否正确，配置验证完成后，再将相关域名的加速服务切换至腾讯云 EdgeOne。
> 

- 当迁移工具运行完毕后，如果迁移中出现异常，在迁移工具本地目录下会生成一个csv文件（report-${timespamp}.csv），记录了运行中遇到的错误，您可以参考该文件查看迁移结果及遇到的问题。

- 当工具上显示迁移完成后，您需要前往腾讯云 EdgeOne 控制台内，查看该域名的站点加速配置及规则引擎配置、安全防护配置是否符合预期。
   

> **说明：**
> 
> 当前域名配置的源站相关配置将迁移至源站组配置中，
> 


建议您通过以下步骤来验证域名迁移后访问是否符合预期。

1. 前往 边缘安全加速平台 EO 控制台，在控制台内，点击站点列表，进入当前已迁移域名的站点；

2. 点击 域名服务 > 域名管理，找到已迁移域名，查看 EdgeOne 为该域名分配的 Cname 信息。例如：`www.example.com.eo.dnse3.com`


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027441501/14f0b0316bfb11eebded5254000903c0.png?q-sign-algorithm=sha1&q-ak=AKID6bk_fkKcpYLELlid5x_RssHZYzGSqgzGdk8_m2yVS7J29dHdL3lHbAAQlPPi64LS&q-sign-time=1697447415;1697451015&q-key-time=1697447415;1697451015&q-header-list=&q-url-param-list=&q-signature=1c8c665912c0e47c64ec530d818e171167526401&x-cos-security-token=qJH6fbqpcGSkKO5AbfqWoagOaeOV9vMa377a91373e01b73c31940e96b53f5601yobH5qMIJiXQkSUnjn4ShCtMuw0-ma-vgWLLWkYU5VYtUWbZ9LpfnI1JQ6zcIq2resC9HNxNfsoKhW9XYsfhfcKnlH8ogd-OTfZIbV81WxsK9xB58t81bsQ7ZQL9-E7k2gIqa8rssXL3nRolBHVHzLXctYWo1h0kSSrUzhKtkIDrBnOU_sJau5dktgeRgoYu5ijTqtnymn15oLDH5wJDFXuKkVWZ3Rtwq10xi3JjDUaH3NRoDE2wkk62wgiCrrxQevsBSDuKc_mqtPFJT2Ck_CWdRpEKbjqwdB6ZIU3QvRX0EcxiMMwwR1pUXz3QZxrIofwhMs6wG8bn49C6fKNBYrVM_DQdFHrwbjqhQ_t4TMVU-TYOE-j7Qzdh-UosWArR)

3. 获取 EdgeOne 平台为该域名分配的节点 IP 信息，可通过在命令行工具中输入 `ping www.example.com.eo.dnse3.com`，查看返回的对应节点 IP。


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027441501/7d64e3a96bfb11eebded5254000903c0.png?q-sign-algorithm=sha1&q-ak=AKIDJOvxPx0WSNi69DNBpQyudhJkkagwez33OkrGRZva7aAGaMtCoj4q43rFbXqNfbsb&q-sign-time=1697447415;1697451015&q-key-time=1697447415;1697451015&q-header-list=&q-url-param-list=&q-signature=a91d4695966692f78a4246cb46118b096b8e7ba5&x-cos-security-token=Hz5BC0k4HQ1YfHVNDPQZqJehYe6f981a9e9b9a1967ad602da0b1b02db8560cb9n8iSTSm9aFy1YKudStx0XpG7tIW3wxZtWlZKms_hYB42ZojvUpjbTlcFvQZbfVQZv2ZyIJ1uKN_qhG8qET9EMh84MAyzBqKItNPGBQl_BIj8sKGQerSdLPkFBca-wYsoFs-gYFEY7NVK1ox_hqQclCuz14K3uqV_STHuBSubk9HhqndvTZC77vqxu_mkfLkRD4YovXANc60ByJrPOwhExbfv8f_3wN3N5H_QI3xM38pSD1UV1FvMJeGMdICDlc9THwtubEahGAzrqtICEyaJYbDfh0Gjc3gg7T9TNnaN8FWCkpLcf5MSJbvSQAB_0IQtbn7YoKNGiIY4wSc2rl7j0KTPOm897xOUi78dCpLTbcf7Fc7Uefpy9RdicqVmXmN-)

4. 将步骤3获取的节点IP（43.152.53.230）和加速域名（`www.example.com`）绑定到电脑本地 hosts 文件中，如下所示：
![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027441501/d39ac2556bfb11eeada95254007bf3f5.png?q-sign-algorithm=sha1&q-ak=AKID3XgCjMvdw2MPiLlO00DoMuUzVjYf8da4pyTUOhLwhTpnYbD7G9pmEhsMBFyI7Zv1&q-sign-time=1697447415;1697451015&q-key-time=1697447415;1697451015&q-header-list=&q-url-param-list=&q-signature=37ee9312b644896465163ca7ea82283271b2ece0&x-cos-security-token=qJH6fbqpcGSkKO5AbfqWoagOaeOV9vMa952754d5f94725742d11cba59bcd638ayobH5qMIJiXQkSUnjn4ShCtMuw0-ma-vgWLLWkYU5VYtUWbZ9LpfnI1JQ6zcIq2resC9HNxNfsoKhW9XYsfhfcKnlH8ogd-OTfZIbV81WxsK9xB58t81bsQ7ZQL9-E7k2gIqa8rssXL3nRolBHVHzLXctYWo1h0kSSrUzhKtkIDrBnOU_sJau5dktgeRgoYuxv5ZxEt9xeRPqclt20hv9xr9gPY7iDHWPuD8v3IORS6f6kQGIMFhOry6BPLhXfomFQ8UQEJYayJPImFidvdNS4Bb3Jgbp0TR4NzenFPctDONVwW2AtG2IcAznahsIHA72-4O1kTMMvLUTpz1vO90u15XbgjVkXys_pUpKvXaMl6BBFRuw0ofD4fpajz8oFQj)
   

> **说明：**
> 
> Windows 系统 Hosts 文件路径位置为 C:\Windows\System32\drivers\etc\hosts。
> 

> Mac 系统 Hosts 文件路径为/etc/hosts。
> 

5. 访问该域名下的热门 URL 内容，验证对应域名服务是否符合预期。


## 不支持迁移的配置
1. 源站配置内，如果该源站为多源站，或者源站填写了端口和权重信息，不支持批量迁移，需手动迁移配置，参考：[源站组配置](https://cloud.tencent.com/document/product/1552/70904)。

2. 源站配置内，如果该源站为第三方对象存储，不支持批量迁移，需手动迁移配置，参考：[源站组配置](https://cloud.tencent.com/document/product/1552/70904)。

3. EdgeOne 智能压缩暂不支持按照文件后缀或者 Content-Type 配置，如果在 CDN 域名内配置有该类规则，本工具不会进行迁移。建议您迁移后在规则引擎内使用其它条件进行匹配。

4. 以下 HTTPS 相关配置需依赖当前在[腾讯云 SSL 控制台](https://console.cloud.tencent.com/certoverview)内已上传对应的域名托管证书，如果您还未上传证书则无法完成自动迁移，需要您上传 HTTPS 证书到腾讯云 SSL 控制台后手动配置。

  - [HTTPS 强制跳转](https://cloud.tencent.com/document/product/228/41688)

  - [启用 HTTP 2.0](https://cloud.tencent.com/document/product/228/41689)

  - [Quic](https://cloud.tencent.com/document/product/228/51800)

  - [OCSP 装订](https://cloud.tencent.com/document/product/228/41690)

  - [HSTS 配置](https://cloud.tencent.com/document/product/228/44867)

  - [TLS 版本](https://cloud.tencent.com/document/product/228/44868)

5. 加速类型为 ECDN 动态加速或者 ECDN 动静加速的域名，迁移完成后，需手动开启[智能加速](https://cloud.tencent.com/document/product/1552/70959)，为域名开启动态加速。该功能为增值服务能力，相关计费标准参考：[增值服务用量单元费用（后付费）](https://cloud.tencent.com/document/product/1552/94161)。