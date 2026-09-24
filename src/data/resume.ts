import type {
  Locale,
  SiteCopy,
  Project,
  Experience,
  Education,
  Ability,
} from './types.ts';
export type { Locale } from './types.ts';

// Edit each record once; all translated fields require both supported languages.
export const profile = {
  name: 'Jinyuan Zhou',
  email: 'jinyuan.zhou@mail.utoronto.ca',
  personalEmail: 'jinyuanleo@gmail.com',
  phone: '+1 (647) 617-0499',
  phoneHref: '+16476170499',
  github: 'jinyuanZhou-Leo',
  linkedin: 'https://www.linkedin.com/in/jinyuan-zhou/',
  blog: 'https://blog.jyleo.cc',
  resume: '/documents/Jinyuan_Zhou_CV_2026_V2.pdf',
};

export const content: Record<Locale, SiteCopy> = {
  zh: {
    title: 'Jinyuan Zhou — 计算机工程 · 个人简历',
    description:
      '多伦多大学计算机工程学生 Jinyuan Zhou 的个人简历。探索 Rust 系统开发、全栈应用、机器人与 AI 项目。',
    nav: {
      work: '项目',
      experience: '经历',
      about: '关于',
      contact: '联系',
    },
    skip: '跳转至主要内容',
    blog: '个人博客',
    download: '下载简历',
    hero: {
      intro: '你好，我是',
      line: '以好奇心为起点，',
      emphasis: '把想法写成现实。',
      description: '多伦多大学 · 计算机工程 · 大二学生',
      cta: '看看我的作品',
      location: '加拿大，多伦多',
      caption: '一点灵感，一行代码。',
      scroll: '向下探索',
    },
    projects: {
      label: 'SELECTED WORK',
      title: '想法，正在运行。',
      intro: '课程作业、个人项目，以及动手过程中的学习。',
      view: '查看源码',
      previous: '上一个项目',
      next: '下一个项目',
      technologies: '技术',
      overview: '全部项目概览',
    },
    experience: {
      label: 'EXPERIENCE',
      title: '实习中的\n学习与实践。',
    },
    about: {
      label: 'A LITTLE ABOUT ME',
      title: '认真构建，\n保持好奇。',
      text: '我是 Jinyuan，多伦多大学计算机工程大二学生。喜欢拆开问题、理解原理，再把它们重新组合成有用的东西。从一颗棋子的落点，到一个 shell 的执行过程，我在动手中学习。',
      skills: '学习与使用',
      people: '不止于代码',
      languageText: '中文 · 母语 / 英语 · 专业工作水平',
      learning: '持续学习中',
    },
    github: {
      title: '代码还在生长。',
      subtitle: '来自 GitHub 的最新仓库动态',
      loading: '正在读取 GitHub…',
      error: '暂时无法读取 GitHub 数据。',
      retry: '重新加载',
      live: 'GitHub 数据同步于',
      updated: '最近推送',
      stars: '星标',
      forks: '派生',
      visit: '前往 GitHub',
      empty: '暂无公开仓库',
    },
    contact: {
      label: 'SAY HELLO',
      title: '下一个好想法，\n从一句你好开始。',
      text: '聊聊工程、分享灵感，或一起做些有意思的事情。',
      email: '发一封邮件',
      copy: '复制邮箱',
      copied: '邮箱已复制',
      copyError: '复制未成功，请直接选择邮箱文本。',
      social: '联系方式',
      personal: '个人邮箱',
      university: '学校邮箱',
      phone: '电话',
      back: '回到顶部',
      footer: '越努力越幸运',
    },
  },
  en: {
    title: 'Jinyuan Zhou — Computer Engineering · Portfolio',
    description:
      'Jinyuan Zhou, Computer Engineering student at the University of Toronto. Explore Rust systems, full-stack applications, robotics and AI projects.',
    nav: {
      work: 'Work',
      experience: 'Experience',
      about: 'About',
      contact: 'Contact',
    },
    skip: 'Skip to main content',
    blog: 'Blog',
    download: 'Download CV',
    hero: {
      intro: 'Hey, I’m',
      line: 'A little curiosity.',
      emphasis: 'A lot to build.',
      description:
        'Second-year Computer Engineering student at the University of Toronto.',
      cta: 'Explore my work',
      location: 'Toronto, Canada',
      caption: 'A little inspiration. A line of code.',
      scroll: 'SCROLL TO EXPLORE',
    },
    projects: {
      label: 'SELECTED WORK',
      title: 'Ideas, in motion.',
      intro:
        'Coursework, personal projects, and what I’m learning along the way.',
      view: 'View source',
      previous: 'Previous project',
      next: 'Next project',
      technologies: 'Technologies',
      overview: 'All projects',
    },
    experience: {
      label: 'EXPERIENCE',
      title: 'Learning through\nmy internship.',
    },
    about: {
      label: 'A LITTLE ABOUT ME',
      title: 'Build thoughtfully.\nStay curious.',
      text: 'I’m Jinyuan, a second-year Computer Engineering student at the University of Toronto. I like taking problems apart, understanding the principles, and putting them back together as something useful. From a move on a board to a shell executing a command, I learn by building.',
      skills: 'Learning & building',
      people: 'Beyond the code',
      languageText: 'Chinese · Native / English · Professional working',
      learning: 'Always learning',
    },
    github: {
      title: 'Always a work in progress.',
      subtitle: 'The latest repository activity from GitHub',
      loading: 'Reading from GitHub…',
      error: 'GitHub data is temporarily unavailable.',
      retry: 'Try again',
      live: 'GitHub data synced at',
      updated: 'Last pushed',
      stars: 'Stars',
      forks: 'Forks',
      visit: 'Visit GitHub',
      empty: 'No public repositories yet',
    },
    contact: {
      label: 'SAY HELLO',
      title: 'Good things start\nwith a hello.',
      text: 'Talk engineering, exchange ideas, or build something interesting together.',
      email: 'Send an email',
      copy: 'Copy email',
      copied: 'Email copied',
      copyError: 'Could not copy. Please select the email text instead.',
      social: 'GET IN TOUCH',
      personal: 'Personal email',
      university: 'University email',
      phone: 'Phone',
      back: 'Back to top',
      footer: 'The harder I work, the luckier I get.',
    },
  },
};

export const projects: readonly Project[] = [
  {
    id: 'jsh',
    name: 'jsh',
    category: {
      zh: '系统开发',
      en: 'SYSTEMS',
    },
    date: {
      zh: '2026.05 — 至今 · 个人项目 · 开发者',
      en: 'MAY 2026 — PRESENT · Personal project · Developer',
    },
    tags: ['Rust'],
    title: {
      zh: '从零开始，理解一个 Shell。',
      en: 'A shell. Built from first principles.',
    },
    description: {
      zh: '用 Rust 构建交互式 Unix shell，设计词法分析—语法分析—AST—执行器架构，支持引号、转义、波浪号展开、内置命令与外部程序。实现管道、文件描述符重定向、命令串联、&&/|| 短路求值及 PATH 查找，并为 shell 解析和进程行为编写单元与集成测试。',
      en: 'Built an interactive Unix shell in Rust around a lexer–parser–AST–executor architecture. Implemented quoting, escaping, tilde expansion, built-ins, external programs, pipelines, file-descriptor redirection, command sequencing, &&/|| short-circuit evaluation, relative and absolute path resolution, PATH lookup, and unit/integration tests for parsing and process behavior.',
    },
    repository: {
      owner: 'jinyuanZhou-Leo',
      name: 'jsh',
    },
    openSource: true,
    visual: {
      kind: 'terminal',
      command: 'jsh',
      caption: {
        zh: '从第一行代码开始。',
        en: 'Start with the first line.',
      },
    },
  },
  {
    id: 'reversi',
    name: 'Reversi AI',
    category: {
      zh: '算法与 AI',
      en: 'ALGORITHMS & AI',
    },
    date: {
      zh: '2026.03 · 多伦多大学 APS105 · 开发者',
      en: 'MAR 2026 · University of Toronto APS105 · Developer',
    },
    tags: ['C'],
    title: {
      zh: '每一步，都多想几步。',
      en: 'Every move. A few steps ahead.',
    },
    description: {
      zh: '在 APS105 计算机基础课程的黑白棋比赛中，440 名学生中排名第 2。构建评估棋盘局面并选择最优落子的算法，结合极小极大搜索、迭代加深、走法排序和 Alpha–beta 剪枝，在固定时限内探索更深的博弈树。',
      en: 'Ranked 2nd out of 440 students in the APS105 Computer Fundamentals Reversi competition. Built an algorithm to evaluate board positions and select optimal moves, using minimax, iterative deepening, move ordering and alpha–beta pruning to search deeper within a fixed time limit.',
    },
    openSource: false,
    visual: {
      kind: 'reversi',
      board: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0,
        0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 2, 1, 2, 1, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      rank: 2,
      total: 440,
      caption: {
        zh: 'APS105 · 课程排名',
        en: 'APS105 · COURSE RANK',
      },
    },
    tone: '#e8e5dd',
  },
  {
    id: 'semestra',
    name: 'Semestra',
    category: {
      zh: '全栈应用',
      en: 'FULL-STACK',
    },
    date: {
      zh: '2025.11 — 2026.08 · 个人项目 · 开发者',
      en: 'NOV 2025 — AUG 2026 · Personal project · Developer',
    },
    tags: ['React 19', 'TypeScript', 'FastAPI', 'SQLAlchemy', 'SQLite'],
    title: {
      zh: '让学业管理，井井有条。',
      en: 'A little more order to student life.',
    },
    description: {
      zh: '构思并设计覆盖课程、作业、GPA 和学术资源的全栈学业管理平台。制定产品需求，指导 AI 编码代理使用 React 19、TypeScript、FastAPI、SQLAlchemy 与 SQLite 实现，并迭代设计可扩展插件系统、Google OAuth 和多语言支持。',
      en: 'Conceived and designed a full-stack platform for tracking courses, assignments, GPA and academic resources. Defined product requirements and directed AI coding agents to implement it with React 19, TypeScript, FastAPI, SQLAlchemy and SQLite, iteratively guiding the plugin system, Google OAuth and multilingual support.',
    },
    repository: {
      owner: 'jinyuanZhou-Leo',
      name: 'Semestra',
    },
    openSource: true,
    tone: '#dce2d3',
  },
  {
    id: 'ischedule',
    name: 'iSchedule',
    category: {
      zh: '自动化工具',
      en: 'AUTOMATION',
    },
    date: {
      zh: '2024.08 — 2025.01 · 南京外国语学校 · 开发者',
      en: 'AUG 2024 — JAN 2025 · Nanjing Foreign Language School · Developer',
    },
    tags: ['Python'],
    title: {
      zh: '少一点手动，多一点时间。',
      en: 'Less admin. More time.',
    },
    description: {
      zh: '通过 Python 爬虫与网络库读取学校 LMS 数据，自动生成可导入的课程日历。优化解析逻辑，实现最高 2 倍速度提升，日历文件体积减少 50% 以上，让学生轻松导入课表。',
      en: 'Fetched and processed school LMS data with Python web crawling and networking libraries to generate importable calendars. Optimized parsing for up to 2× speed and over 50% smaller files, making schedule imports easier for students.',
    },
    repository: {
      owner: 'jinyuanZhou-Leo',
      name: 'iSchedule',
    },
    openSource: true,
    tone: '#e5e6da',
  },
  {
    id: 'research',
    name: 'LLMCoTAnalyzer',
    category: {
      zh: '研究探索',
      en: 'RESEARCH',
    },
    date: {
      zh: '2025.04 — 2025.05 · AP Statistics 12 研究项目',
      en: 'APR 2025 — MAY 2025 · AP Statistics 12 Research Project',
    },
    tags: ['Python'],
    title: {
      zh: '模型，如何反复确认自己？',
      en: 'How do models double-check themselves?',
    },
    description: {
      zh: '设计并开展实验，研究大语言模型参数量与思维链中重复自我验证行为的关系。搭建多线程 Python 实验流程，通过兼容 OpenAI 的 API 查询多个模型、采集推理轨迹并自动处理重复试验结果；设计并集成使用 Transformer 嵌入与逻辑回归的语义分类流程，识别自我验证语句。',
      en: 'Designed experiments on the relationship between LLM parameter count and repetitive self-verification in chain-of-thought reasoning. Built a multithreaded Python pipeline to query models through OpenAI-compatible APIs, collect reasoning traces and automatically process results across repeated trials. Designed and integrated a semantic classification workflow using Transformer embeddings and logistic regression to identify self-verification statements.',
    },
    repository: {
      owner: 'jinyuanZhou-Leo',
      name: 'LLMCoTAnalyzer',
    },
    openSource: true,
    tone: '#e8e6df',
  },
];

export const experiences: readonly Experience[] = [
  {
    id: 'howso-2026',
    company: {
      zh: 'Howso Technology（华苏科技）',
      en: 'Howso Technology (Huasu Technology)',
    },
    role: {
      zh: '软件工程师实习生',
      en: 'Software Engineer Intern',
    },
    start: '2026-06',
    end: '2026-07',
    location: {
      zh: '中国 · 江苏南京',
      en: 'Nanjing, Jiangsu, China',
    },
    points: [
      {
        zh: '基于 MQTT 与 Unitree Python SDK，为宇树 G1 / GO2 实现运动控制和音频功能。',
        en: 'Implemented motion control and audio functionality for Unitree G1 / GO2 using MQTT and the Unitree Python SDK.',
      },
      {
        zh: '设计并集成 React 19 + FastAPI 投标分析平台，使用 Qdrant 驱动的 RAG 自动生成响应矩阵，并指导 AI 编码代理完成实现。',
        en: 'Designed and integrated a React 19 + FastAPI bid analysis platform with Qdrant-powered RAG for automated response matrix generation, using AI coding agents for implementation.',
      },
      {
        zh: '通过在宇树 G1 / GO2 平台上反复进行基于 MQTT 的测试，调试并验证机器人控制流程。',
        en: 'Debugged and validated robot control workflows through repeated MQTT-based testing on Unitree G1 / GO2 platforms.',
      },
    ],
    tags: ['React 19', 'FastAPI', 'Qdrant / RAG', 'MQTT'],
  },
];

export const education: readonly Education[] = [
  {
    id: 'nfsl',
    name: {
      zh: '南京外国语学校 · 中加国际高中',
      en: 'Nanjing Foreign Language School',
    },
    degree: {
      zh: 'BC Dogwood Diploma',
      en: 'British Columbia Academy · BC Dogwood Diploma',
    },
    start: '2022',
    end: '2025',
    note: {
      zh: '加拿大 BC 省高中毕业文凭',
      en: 'British Columbia high school diploma',
    },
  },
  {
    id: 'utoronto',
    name: {
      zh: '多伦多大学',
      en: 'University of Toronto',
    },
    degree: {
      zh: '计算机工程 BASc · PEY Co-op',
      en: 'Computer Engineering (BASc) · PEY Co-op',
    },
    end: '2030',
    expected: true,
    gpa: '3.84 / 4.00',
  },
];

export const skills: readonly string[] = [
  'Rust',
  'Python',
  'C/C++',
  'HTML',
  'CSS',
  'JavaScript',
  'FastAPI',
  'PyTorch',
  'Git',
  'SQLAlchemy',
];

export const abilities: readonly Ability[] = [
  {
    id: 'project-management',
    label: {
      zh: '项目管理',
      en: 'Project management',
    },
  },
  {
    id: 'communication',
    label: {
      zh: '沟通',
      en: 'communication',
    },
  },
  {
    id: 'teamwork',
    label: {
      zh: '团队协作',
      en: 'teamwork',
    },
  },
  {
    id: 'critical-thinking',
    label: {
      zh: '批判性思维',
      en: 'critical thinking',
    },
  },
  {
    id: 'research',
    label: {
      zh: '研究',
      en: 'research',
    },
  },
];
