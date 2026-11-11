# Jinyuan Zhou · Personal résumé

面向招聘方的中英双语个人简历。内容来源为 `Jinyuan_Zhou_CV_2026_V2.1.pdf`，展示工程项目、实习、教育、技能及社交联系方式。

## 开发

需要 Node.js 22.12+ 与 pnpm 12。当前使用 Astro 7.3、React 19.3、GSAP 3.15（ScrollTrigger）、Lenis、SWR 2 和 Lucide。

```sh
pnpm install
pnpm exec astro dev --background
pnpm exec astro dev status
pnpm exec astro dev logs
pnpm exec astro dev stop
```

以启动命令返回的 URL 为准。默认英文 `/`，中文 `/zh/`。两种语言均生成静态 HTML，无需服务器端运行时。

```sh
pnpm check
pnpm test
pnpm format:check
pnpm build
pnpm preview
```

`pnpm test` 使用 Node.js 内置测试运行器执行 `tests/*.test.ts`。测试集中验证数据选择、项目卡片渲染、GitHub 请求和不依赖浏览器布局的滚动计算；浏览器交互仍需在桌面、窄屏、减少动画和打印模式下检查。

## 数据模型与维护入口

简历内容采用 `src/data/types.ts` 中的 TypeScript 模型，在 `src/data/resume.ts` 中维护唯一数据源。所有 `Localized` 字段都必须同时提供 `zh` 和 `en`，因此新增内容时不会只更新一个语言版本。

```ts
type ProjectVisual =
  | { kind: 'terminal'; command: string; caption: Localized }
  | {
      kind: 'reversi';
      board: readonly number[];
      rank: number;
      total: number;
      caption: Localized;
    };

interface Project {
  id: string;
  name: string;
  repository?: { owner: string; name: string };
  openSource: boolean;
  visual?: ProjectVisual;
  // category, date, tags, title and description are also part of the model.
}
```

`Project.repository` 是可选的，源码链接由 `{ owner, name }` 生成；没有仓库的课程或私有项目不会出现无效链接。`openSource` 控制该项目是否参与 GitHub 仓库同步。`visual` 是按项目声明的联合类型，`terminal` 和 `reversi` 只负责各自的视觉数据，项目顺序不会改变视觉内容。

当前数组和对应职责如下：

| 数据          | 类型                       | 用途                                            |
| ------------- | -------------------------- | ----------------------------------------------- |
| `projects`    | `readonly Project[]`       | 项目总览、项目卡片和 GitHub 开源仓库选择        |
| `experiences` | `readonly Experience[]`    | 实习条目，由 `ExperienceItem.astro` 逐条渲染    |
| `education`   | `readonly Education[]`     | 教育经历条目，由 `EducationItem.astro` 逐条渲染 |
| `skills`      | `readonly string[]`        | 技术栈图标与标签                                |
| `content`     | `Record<Locale, SiteCopy>` | 页面标题、导航、按钮及各章节双语文案            |
| `profile`     | 个人资料对象               | 姓名、联系方式、社交账号和 PDF 路径             |

新增、删除或重排项目、实习、教育经历和技术栈时，修改对应数组即可；每条记录都应保留稳定且唯一的 `id`。项目视觉、仓库权限和排序都由数据字段表达，组件不依赖“第几个项目”这样的隐含约定。

| 内容                                             | 文件                                                                                                       |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| 类型定义与双语字段约束                           | `src/data/types.ts`                                                                                        |
| 简历事实、双语文案、社交账号和数组               | `src/data/resume.ts`                                                                                       |
| 页面组合                                         | `src/components/ResumePage.astro`                                                                          |
| 首屏、项目、经历、关于、联系                     | `src/components/sections/`                                                                                 |
| 项目卡片                                         | `src/components/interactive/ProjectCard.tsx`（在 Astro 中静态渲染）                                        |
| 日期和仓库链接格式化                             | `src/lib/content.ts`                                                                                       |
| GitHub API 校验、选择和缓存                      | `src/lib/github.ts`、`src/components/interactive/GitHubActivity.tsx`                                       |
| 滚动动效生命周期与各章节编排                     | `src/lib/motion/`（`index.ts` 为入口，各章节一个模块，`math.ts` 为可测试的纯函数）                         |
| 设计 Token（颜色、字号、间距、圆角、阴影、动效） | `src/styles/tokens.css`、`src/lib/motion/tokens.ts`，规则见 [docs/design-system.md](docs/design-system.md) |
| 项目倾斜漂移带与横向卷轴                         | `src/components/ProjectGrid.astro`、`src/components/sections/Projects.astro`、`src/styles/projects.css`    |
| 构建时文字拆分                                   | `src/components/text/`                                                                                     |
| 各模块样式、响应式与打印                         | `src/styles/`                                                                                              |
| 原始下载简历                                     | `public/documents/Jinyuan_Zhou_CV_2026_V2.1.pdf`                                                           |
| 首屏 Gallery 图片                                | `public/images/gallery/`，源照片位于 `public/` 和 `public/images/IMG_7518.jpeg`                            |

更新简历时，同步修改 `zh` / `en` 内容并替换下载 PDF。GitHub 模块作为 React island 加载；项目卡片和其余履历内容由 Astro 静态渲染。界面图标由 Lucide、技术栈 Logo 由 Simple Icons、平台 Logo 由 Font Awesome Brands 渲染为静态 SVG，路由与语言切换使用 Astro ClientRouter，滚动动效使用 GSAP ScrollTrigger，滚轮平滑使用 Lenis。邮箱复制调用浏览器 Clipboard API。

## GitHub 数据

GitHub 选择从 `projects` 数组派生：只有同时设置 `openSource: true` 和 `repository` 的项目才会请求。每个声明的 `{ owner, name }` 都直接请求 GitHub REST API 的 `/repos/{owner}/{name}` 端点，不读取用户仓库列表，也无需再维护第二份仓库名单。公共 REST API 返回语言、星标、fork 数和最后推送日期；不使用 token，不伪造活动数据或贡献热力图。

SWR 负责内存缓存及请求去重，成功响应另存为 30 分钟有效的本地快照。取消定时轮询、聚焦刷新与重连刷新；刷新页面和切换语言优先复用未过期快照，过期后在下次模块加载时重新获取。请求超时为 10 秒。失败显示明确状态和手动重试，不自动重试限流错误；履历和项目源码链接独立于接口。显示的是请求同步时间，仓库日期是 `pushed_at`。

## 视觉与动画

首页使用最新提交的 17 张个人照片组成 Gallery，照片按原始长宽比填满格子，超出的边缘会被裁切；页脚使用银色纸鹤静物。字体通过 Fontsource 本地提供 Manrope 与 Noto Sans SC，不依赖第三方字体 CDN；字体 token 可集中替换。未复制喜茶品牌标识或其专用字体文件。

首屏 Gallery 的五格照片分别沿不同方向做 Ken Burns 缩放与平移，每次只随机更换一格，新旧照片交叉淡入淡出，换图时保持横图或竖图方向不变。

滚动动效在 `src/lib/motion/` 中从零编排，整体思路是“一叠纸页与墨水”：简历的每一章是一页纸，下一页从下方滑上来盖住上一页；文字像墨水一样逐行浮现，空间运动只在需要表达层次的地方使用。

- **开场**：照片格自下而上逐格展开并从放大状态回落，名字逐字升起，句号最后弹出，导航从上方落下。
- **章节转场（桌面）**：所有章节遵循同一条规则（`stack.ts`）。一章读到最后一行时停住，下一章带着圆角上边缘滑上来，落定时圆角压平；被盖住的一章同时微微缩小、变暗，完全盖住后停止绘制。首屏、项目、经历、关于、GitHub 依次叠放，深色页脚作为封底最后盖上。首屏是第一次出现：照片后退、缩小、变暗。
- **项目内部的衔接**：倾斜的项目总览在卷轴到来时逐渐摆正、缩小并淡出，有序的横向卷轴接替它。
- **项目**：两行倾斜的项目卡片相向漂移，快速滚动时会随速度轻微倾斜；随后进入固定的横向卷轴，当前项目居中放大，相邻项目后退变暗，插画以不同速率视差移动，计数器滚动翻页，停下时自动对齐到整张卡片。键盘焦点、导航锚点和 `#项目 id` 都会把对应卡片移到中央。
- **经历**：左侧标题吸附，右侧每条经历逐行出现，每个要点先画出分隔线再浮现文字，左侧细轨随阅读进度填充；这一章用浅灰底色（`data-tone="muted"`）区分。
- **关于**：教育是一条随滚动推进的时间轴，标记点带着年份沿轴移动，到达哪所学校的节点，哪所学校的信息就展开，GPA 随之从 0 数到实际值。技术栈图标从四散的位置聚合成网格，落定后一道“背光”沿对角线扫过所有图标；精细指针下每个图标会朝光标倾斜。
- **GitHub 与页脚**：GitHub 区由外层 Astro 容器上的类名驱动 CSS 入场，不修改 React 拥有的节点；页脚按章节转场规则盖上 GitHub 一章，纸鹤随滚动旋转，底部座右铭跑马灯会跟随滚动方向并随速度加速。
- **全局**：向下阅读时导航让开、向上时回来；导航底部细线显示整页进度，并标记当前章节；精细指针设备上有跟随光标的圆环和磁吸按钮。

所有动画都在 GSAP `matchMedia` 上下文中创建：跨越 761px 断点、切换系统减少动画偏好或打印时，内联样式和固定区会被完整还原。没有脚本、开启减少动画或打印时，页面是一份完整可读的普通文档；标题和段落的拆分在构建时完成，读屏器读取隐藏的完整文本。ResizeObserver 在字体、GitHub 数据和换行变化后刷新触发位置。

项目漂移带由 `projects` 数组生成，改编自 React Bits Grid Motion 的倾斜、相向移动行；详细卡片由 `ProjectCard` 根据项目数据渲染，视觉类型和源码链接与项目顺序无关，没有专属插画的项目使用其技术栈图标。关于区按 `education` 和 `skills` 数组渲染教育与技术栈。Semestra-Next 卡片使用其 GitHub README 中的截图（`public/images/projects/`）。GitHub 使用延迟加载的 React Bits Pixel Blast 背景；在后台或不可见时暂停绘制，减少动画时释放 WebGL。来源与适配说明见 [docs/react-bits.md](docs/react-bits.md)，上游许可保留在 [docs/licenses/react-bits.txt](docs/licenses/react-bits.txt)。

资料来源和图片生成提示词见 [docs/art-direction.md](docs/art-direction.md)。

## 发布

`pnpm build` 输出 `dist/`，可部署到任意静态主机，包括 Debian 12 上的 Nginx。保留目录路由，确保 `/zh/` 返回 `zh/index.html`。下载 PDF 包含原简历中的邮箱和电话，与网页联系方式一致。
