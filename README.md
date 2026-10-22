# 官网1.4.1：ChatNote 0.16.1 · 2026-10-22

同步0.16.1签名安装包、三语变更记录与静态更新清单；新增贡献者主页修复说明，继承此前0.16.0支线汇合与画布功能。上一正式版本0.15.0继续保留。

# 官网1.4.0：ChatNote 0.15.0 · 2026-10-19

同步0.15.0安装包、摘要与签名更新清单；三语介绍整理稿自动保存、全文搜索、长会话存储与导出范围。下载页明确新版数据库不支持直接降级，说明升级前备份恢复步骤；隐私政策补充独立升级备份的保留规则。Cloudflare统计的域名限制、DNT/GPC排除和公开token沿用，不新增数据采集。

# 官网1.3.1：访问统计

已接入 Cloudflare Web Analytics，27个三语页面统一覆盖，统计仅在维护者登录的 Cloudflare 后台查看，不在官网展示。客户端仍为0.14.0。查看入口、指标口径、下载计数工具与停用方法见 [ANALYTICS.md](ANALYTICS.md)。

# 0.14.0与官网1.3.0

官网统一安装包下载，当前与回退入口均不展示直接程序。0.14.0安装包、签名和更新清单在应用仓库发行；历史程序原字节保留。

# ChatNote 官网与公开下载

官网：https://mkcorleone.github.io/chatnote-site/

本仓库仅包含官网、公开说明与合成展示素材。ChatNote应用源码在公开的[应用仓库](https://github.com/MKCorleonE/ChatNote)，采用PolyForm Perimeter 1.0.1（源码可见，限制竞争用途）。本仓库继续维护官网和updates/stable.json；0.13.0起安装包只在应用仓库发布。旧的下载附件保留为历史。

## 下载

- [当前版本 0.16.1](https://github.com/MKCorleonE/ChatNote/releases/tag/v0.16.1)
- [回退版本 0.15.0](https://github.com/MKCorleonE/ChatNote/releases/tag/v0.15.0)
- [快速开始](https://mkcorleone.github.io/chatnote-site/guide.html) / [隐私政策](https://mkcorleone.github.io/chatnote-site/privacy.html) / [测试版使用说明](https://mkcorleone.github.io/chatnote-site/terms.html)

Windows x64 免费测试版，使用者自备模型 API。安装包尚未代码签名；请核对下载来源与 SHA-256，不要关闭系统安全防护。模型费用及条款由对应服务商决定。

## 修改网站

无需依赖安装，使用 Node.js 运行：

```text
npm run build
npm run check
npm run dev
```

本地地址打印为 `http://127.0.0.1:4174/chatnote-site/`，刻意带项目路径，以便检查 GitHub Pages 路径兼容性。

| 要改什么 | 文件 |
| --- | --- |
| 三语文案 | `data/zh-Hans.json`、`data/zh-Hant.json`、`data/en.json`；保持键和数组结构相同 |
| 版本、日期、下载文件名、大小、校验值 | `data/versions.json`，所有版本化下载链接集中由它生成 |
| 页面结构 | `scripts/build.mjs`、`scripts/home.mjs`；生成 27 个静态页面后一起提交 |
| 配色、响应布局、弹性动效 | `assets/tokens.css`、`assets/site.css` |
| 森林滚动、功能跟随、上下文示意、短时复制提示 | `assets/site.js` |
| 实际产品截图与合成演示 | `assets/`；只能使用合成或明确允许公开的数据 |
| 静态检查与本地预览 | `scripts/check.mjs`、`scripts/serve.mjs` |

首页为“森林主线开场 → 三个功能 → 下载”。详细信息保留在独立的三语指南、FAQ、下载/校验、联系、隐私、使用说明、更新日志及试用页。

Pages 从 `main` 根目录发布，无运行时框架、CDN 字体或自建后端；访问统计使用 Cloudflare Web Analytics。语言使用独立地址，不在启动时先闪其他语言。降低动态效果遵循系统设置。

## 后续公开版本

1. 客户端在私有仓库完成验证与交付，审阅公开范围。
2. 复制已交付的原始程序与安装包到本仓库草稿 Release；每版独立 `SHA256SUMS.txt`，只列实际公开附件。
3. 核对上传大小与远程 SHA-256；完成后公开 Release。不要覆盖已发布的同名文件，修改程序须使用新版本。
4. 更新 `data/versions.json` 和三语更新日志，运行构建/检查；复核公开文件范围后提交、推送。
5. 复核 Pages 部署与匿名完整下载。文件名包含版本，不能用旧文件名的 `latest/download` 跨版本跳转。
6. 手动完成新电脑、真实 API、录音设备和目标地区网络的试用，不把自动测试扩大为实机验收。

## 内容和许可

© 2026 ChatNote，发布者 MKCorleonE。未明确授予的权利保留；公开仓库并不自动授予客户端源码访问权或应用开源许可。客户端第三方组件许可可在应用“关于 → 开源许可”查看。网站没有打包这些组件。

演示以当前 0.12.0 界面与预制合成内容截图制作，首发的45秒MP4已从当前网站移除，历史提交仍保留。当前功能图为合成界面示意，不发送真实模型请求。示例导图由当前应用导出，使用同一组合成学习内容。

建议反馈、隐私问题与开发参与：邮箱 **529023573@qq.com**；小红书号 **1006863642**。请先脱敏，不要发送密钥或完整私人工作区。

网页源码同样采用根目录LICENSE中的PolyForm Perimeter 1.0.1；素材来源和第三方声明分别保留。
