# Jinyuan Zhou · Personal résumé

面向招聘方的中英双语个人简历。内容来源为 `Jinyuan_Zhou_CV_2026.pdf`，展示工程项目、实习、教育、技能及社交联系方式。

## 开发

需要 Node.js 22.12+ 与 pnpm 12。当前使用 Astro 7.3、React 19.3、Motion 13、SWR 2 和 Lucide。

```sh
pnpm install
pnpm exec astro dev --background
pnpm exec astro dev status
pnpm exec astro dev logs
pnpm exec astro dev stop
```

以启动命令返回的 URL 为准。默认中文 `/`，英文 `/en/`。两种语言均生成静态 HTML，无需服务器端运行时。

```sh
pnpm check
pnpm format:check
pnpm build
pnpm preview
```

## 维护入口

| 内容 | 文件 |
| --- | --- |
| 简历事实、双语文案、社交账号、项目链接 | `src/data/resume.ts` |
| 页面组合 | `src/components/ResumePage.astro` |
| 首屏、项目、经历、关于、联系 | `src/components/sections/` |
| GitHub 数据 | `src/components/interactive/` |
| GitHub API 校验 | `src/lib/github.ts` |
| Motion 入场、滚动及清理 | `src/lib/motion.ts` |
| 配色、字体等语义变量 | `src/styles/base.css` |
| 各模块样式 | `src/styles/` 中对应文件 |
| 跨屏幕排版、减少动画、打印 | `src/styles/responsive.css` |
| 原始下载简历 | `public/documents/Jinyuan_Zhou_CV_2026.pdf` |
| 原创主视觉 | `public/images/hero.webp` |

更新简历时，同步修改 `zh` / `en` 内容并替换下载 PDF。履历内容静态渲染；只有 GitHub 模块使用 `client:visible` 加载 React。界面图标由 Lucide、技术栈 Logo 由 Simple Icons、平台 Logo 由 Font Awesome Brands 渲染为静态 SVG，路由与语言切换使用 Astro 官方 i18n / ClientRouter，动画使用 Motion。邮箱复制调用浏览器 Clipboard API。

## GitHub 数据

通过公共 REST API 一次读取用户仓库，筛选 `jsh`、`Semestra`、`iSchedule` 与 `LLMCoTAnalyzer`，显示语言、星标、fork 数和最后推送日期。不使用 token，不伪造活动数据或贡献热力图。

SWR 负责缓存及请求去重：60 秒去重窗口、5 分钟刷新；隐藏页面和离线时不轮询。请求超时为 10 秒。失败显示明确状态和手动重试，不自动重试限流错误；履历和项目源码链接独立于接口。显示的是请求同步时间，仓库日期是 `pushed_at`。

## 视觉与动画

参考喜茶的实物摄影、黑白留白与清晰排版，使用原创茶杯／键盘／棋子主视觉和页脚银色纸鹤静物，保持材质统一。字体通过 Fontsource 本地提供 Manrope 与 Noto Sans SC，不依赖第三方字体 CDN；字体 token 可集中替换。未复制喜茶品牌标识或其专用字体文件。

动画包括首屏错落入场、标题进入视口、主视觉随滚动轻微缩放、链接与项目视觉 hover、Astro 页面过渡与项目随滚动显现。支持系统 `prefers-reduced-motion`；内容不依赖动画成功执行才可见。没有深浅色切换，颜色已使用语义变量组织。

资料来源和图片生成提示词见 [docs/art-direction.md](docs/art-direction.md)。

## 发布

`pnpm build` 输出 `dist/`，可部署到任意静态主机，包括 Debian 12 上的 Nginx。保留目录路由，确保 `/en/` 返回 `en/index.html`。站点尚未绑定正式域名，因此未硬编码 canonical URL。下载 PDF 包含原简历中的邮箱和电话，与网页联系方式一致。
