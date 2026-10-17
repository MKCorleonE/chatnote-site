# 官网统计与查看方法

官网 1.3.1，2026-10-17。官网继续由 GitHub Pages 托管，客户端仍为 0.14.0。

## 查看访问数据

1. 登录 [Cloudflare 控制台](https://dash.cloudflare.com/)，使用创建统计站点时的同一账号。
2. 进入 **Web Analytics**，选择 **mkcorleone.github.io**。
3. 选择过去24小时、7天或30天。可按网站路径 `/chatnote-site/`、来源、设备、国家/地区等筛选。

- **Visits**：从外部网站或直接入口发起的访问次数；一次访问可以浏览多个页面。不是去重的实际人数。
- **Page views**：页面浏览次数；刷新和反复访问可能增加计数。
- **Page load time / Core Web Vitals**：页面加载速度与响应、布局稳定性。
- 新接入只统计启用后的访问，历史访问不能补回。官方说明数据可能延迟几分钟；低流量时可能显示数据不足。
- Cloudflare 目前不支持自定义事件和 UTM 查询参数统计，因此这里没有“下载按钮点击”事件，也不能保证识别来自小红书等应用的来源。
- 浏览器拦截、网络问题、DNT/GPC 隐私选择会造成漏计；数据用于观察趋势。

只有有权登录对应 Cloudflare 账号的人能查看这个后台。官网不展示统计数字、不内嵌管理后台，也不放置登录凭据。

## 查看下载次数

GitHub 给每个 Release 附件提供公开的 `download_count`。应用仓库和历史官网仓库分别查询，不能把源码压缩包、签名或校验文件混入安装包统计。

维护者在本仓库运行 `npm run downloads`，会显示各版本安装包和直接程序的计数。若匿名接口限流，用已有的本机 GitHub 登录运行 `npm run downloads -- --github-login`。凭据只在内存读取，发送给 api.github.com，不写入源码、参数或统计文件；该工具不在浏览器中运行。

需要保留趋势时，加上 `--save`，例如 `npm run downloads -- --github-login --save`。快照只存本机忽略目录 `.cache/download-counts/`；每次手动运行保存一个时间点，没有额外创建定时任务。

安装包下载包含重复下载、发布验证和应用更新，不能等同新增用户、安装成功或活跃人数。公开发行附件的下载计数对其他人也可查询。仅累计值无法准确还原此前每天的变化。

## 配置与数据流

- `data/analytics.json` 只包含公开的 Cloudflare 站点标识和生效范围，不是 API 密钥或后台访问凭据。
- 构建器在27个三语业务页末尾生成一次本地加载器；加载器仅在 HTTPS 的 `mkcorleone.github.io/chatnote-site/` 下加载官方 `https://static.cloudflareinsights.com/beacon.min.js`。
- 官方脚本向 `https://cloudflareinsights.com/cdn-cgi/rum` 报告访问与性能数据；不使用分析 Cookie、不增加账号、不发送聊天、笔记、模型凭据或客户端使用记录。
- 本地预览、其他项目路径和镜像域名不加载统计；尊重 `navigator.doNotTrack === '1'` 和 Global Privacy Control。
- 404及独立的离线导图示例不接入统计。统计服务不可用不会阻止网站导航或下载。
- 三语隐私政策同步说明 Cloudflare 与 GitHub 的数据流，并链接其隐私政策。
- 停用：把 `enabled` 改为 `false`，重新构建并发布。构建器会移除加载器和对应隐私段落。
- 修改域名或路径前，先审阅配置验证、加载器范围和 Cloudflare 后台站点设置，避免预览或其他项目误报。

## 验证边界

自动检查包含三语结构、27页加载器、29个HTML及本地资源链接，以及正式环境加载、本地/镜像排除、隐私信号、重复加载和配置校验。实际后台入库需在发布后用真实浏览器访问并查看 Cloudflare；未看到入库前不能将脚本部署成功写成统计入库成功。

参考：[接入方式](https://developers.cloudflare.com/web-analytics/get-started/)、[指标定义](https://developers.cloudflare.com/web-analytics/data-metrics/high-level-metrics/)、[限制与常见问题](https://developers.cloudflare.com/web-analytics/faq/)、[GitHub下载计数接口](https://docs.github.com/en/rest/releases/assets)。
