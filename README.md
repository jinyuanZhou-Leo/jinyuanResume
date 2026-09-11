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
| 项目滚动总览 | `src/components/ProjectGrid.astro`、`src/styles/project-grid.css` |
| 分步阅读布局 | `src/styles/reading-sequence.css` |
| GitHub 像素背景 | `src/components/interactive/PixelBlast.jsx` |
| 各模块样式 | `src/styles/` 中对应文件 |
| 跨屏幕排版、减少动画、打印 | `src/styles/responsive.css` |
| 原始下载简历 | `public/documents/Jinyuan_Zhou_CV_2026.pdf` |
| 原创主视觉 | `public/images/hero.webp` |

更新简历时，同步修改 `zh` / `en` 内容并替换下载 PDF。履历内容静态渲染；只有 GitHub 模块使用 `client:visible` 加载 React。界面图标由 Lucide、技术栈 Logo 由 Simple Icons、平台 Logo 由 Font Awesome Brands 渲染为静态 SVG，路由与语言切换使用 Astro 官方 i18n / ClientRouter，动画使用 Motion，滚轮平滑使用 Lenis。邮箱复制调用浏览器 Clipboard API。

## GitHub 数据

通过公共 REST API 一次读取用户仓库，筛选 `jsh`、`Semestra`、`iSchedule` 与 `LLMCoTAnalyzer`，显示语言、星标、fork 数和最后推送日期。不使用 token，不伪造活动数据或贡献热力图。

SWR 负责内存缓存及请求去重，成功响应另存为 30 分钟有效的本地快照。取消定时轮询、聚焦刷新与重连刷新；刷新页面和切换语言优先复用未过期快照，过期后在下次模块加载时重新获取。请求超时为 10 秒。失败显示明确状态和手动重试，不自动重试限流错误；履历和项目源码链接独立于接口。显示的是请求同步时间，仓库日期是 `pushed_at`。

## 视觉与动画

参考喜茶的实物摄影、黑白留白与清晰排版，使用原创茶杯／键盘／棋子主视觉和页脚银色纸鹤静物，保持材质统一。字体通过 Fontsource 本地提供 Manrope 与 Noto Sans SC，不依赖第三方字体 CDN；字体 token 可集中替换。未复制喜茶品牌标识或其专用字体文件。

首屏内容垂直居中，摄影主视觉停驻并随滚动拉近。其后章节在同一阅读背景中自然延展，Motion 根据滚动位置连续插值背景、正文、辅助文字和分隔线颜色；标题和正文分组进入视口，项目以 160px 位移和轻微缩放逐个显现。进入深色联系区前先释放上一段文字，再引入新内容。Lenis 平滑滚轮与锚点导航，触屏保留原生滚动。ResizeObserver 同步文字换行和动态模块尺寸；反向滚动可逆。样式集中在 `src/styles/motion.css`，遵循系统减少动画偏好。GitHub 动画仅作用于 Astro 外层容器，不改动 React hydration 管理的 DOM。

开发默认使用 4321 严格端口并预构建 SWR。避免同时启动多个共用 `node_modules/.vite` 的开发服务器；若旧页面引用失效的依赖版本，停止旧服务、清理该缓存并重新启动，然后刷新页面。

项目区先以 Grid Motion 风格的倾斜双行展示全部五个项目，再按滚动进度展开详情；桌面标题保持可见。经历右侧条目独立显现。关于区保留介绍文案，桌面左侧停驻，右侧依次展示教育、技术栈、软技能与语言。GitHub 使用延迟加载的 React Bits Pixel Blast 背景；在后台/不可见时暂停绘制，减少动画时释放 WebGL，语言切换卸载资源。来源与适配说明见 [docs/react-bits.md](docs/react-bits.md)。

资料来源和图片生成提示词见 [docs/art-direction.md](docs/art-direction.md)。

## 发布

`pnpm build` 输出 `dist/`，可部署到任意静态主机，包括 Debian 12 上的 Nginx。保留目录路由，确保 `/en/` 返回 `en/index.html`。站点尚未绑定正式域名，因此未硬编码 canonical URL。下载 PDF 包含原简历中的邮箱和电话，与网页联系方式一致。
