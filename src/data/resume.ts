import type {
  Locale,
  SiteCopy,
  Project,
  Experience,
  Education,
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
  resume: '/documents/Jinyuan_Zhou_CV_2026_V2.1.pdf',
};

export const content: Record<Locale, SiteCopy> = {
  zh: {
    title: 'Jinyuan Zhou · 多伦多大学计算机工程',
    description:
      'Jinyuan Zhou，多伦多大学计算机工程大二学生。这里有我的项目、实习经历和联系方式。',
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
      line: '多伦多大学 · 计算机工程',
      description: '大二 · BASc · PEY Co-op',
      cta: '了解更多',
      location: '加拿大 · 多伦多',
      caption: '平时拍的一些照片',
      scroll: '向下滚动',
    },
    projects: {
      label: 'SELECTED WORK',
      title: '个人项目',
      view: '查看源码',
      previous: '上一个项目',
      next: '下一个项目',
      technologies: '技术',
      overview: '全部项目',
    },
    experience: {
      label: 'EXPERIENCE',
      title: '实习经历',
    },
    about: {
      label: 'ABOUT',
      title: '多伦多大学\n计算机工程',
      skills: '常用技术',
    },
    github: {
      title: '开源项目',
      subtitle: '直接读取自 GitHub 的仓库数据',
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
      label: 'CONTACT',
      title: '联系我',
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
    title: 'Jinyuan Zhou · Computer Engineering, University of Toronto',
    description:
      'Jinyuan Zhou, second-year Computer Engineering student at the University of Toronto. Projects, internship experience and contact details.',
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
      line: 'Computer Engineering, University of Toronto',
      description: 'Second year · BASc · PEY Co-op',
      cta: 'Learn more',
      location: 'Toronto, Canada',
      caption: 'A few photos I’ve taken',
      scroll: 'SCROLL',
    },
    projects: {
      label: 'SELECTED WORK',
      title: 'Personal projects',
      view: 'View source',
      previous: 'Previous project',
      next: 'Next project',
      technologies: 'Technologies',
      overview: 'All projects',
    },
    experience: {
      label: 'EXPERIENCE',
      title: 'Internship',
    },
    about: {
      label: 'ABOUT',
      title: 'University of Toronto\nComputer Engineering',
      skills: 'Tools I use',
    },
    github: {
      title: 'Open source',
      subtitle: 'Repository data read live from GitHub',
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
      label: 'CONTACT',
      title: 'Get in touch',
      email: 'Send an email',
      copy: 'Copy email',
      copied: 'Email copied',
      copyError: 'Could not copy. Please select the email text instead.',
      social: 'DETAILS',
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
      zh: '纯 Rust 编写的 Unix Shell Demo',
      en: 'Unix Shell Demo written purely in Rust',
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
        zh: '交互式 shell',
        en: 'interactive shell',
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
      zh: '基于 Alpha–beta 剪枝的黑白棋 AI',
      en: 'Reversi AI with alpha–beta search',
    },
    description: {
      zh: '在 APS105 计算机基础课程的黑白棋比赛中，440 名学生中排名第 2。构建评估棋盘局面并选择落子的算法，结合极小极大搜索、迭代加深、走法排序和 Alpha–beta 剪枝，在固定时限内探索更深的博弈树。',
      en: 'Ranked 2nd out of 440 students in the APS105 Computer Fundamentals Reversi competition. Built an algorithm to evaluate board positions and choose moves, using minimax, iterative deepening, move ordering and alpha–beta pruning to search deeper within a fixed time limit.',
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
    id: 'semestra-next',
    name: 'Semestra-Next',
    category: {
      zh: '全栈应用',
      en: 'FULL-STACK',
    },
    date: {
      zh: '2025.11 — 至今 · 个人项目 · 开发者',
      en: 'NOV 2025 — PRESENT · Personal project · Developer',
    },
    tags: ['React 19', 'TypeScript', 'FastAPI', 'SQLite', 'Pydantic AI'],
    title: {
      zh: '把整个学业放在一处：课程、成绩、课表、待办，还有一个什么都知道的 AI 助手。',
      en: 'Your whole degree in one place: courses, grades, schedule, tasks, and an AI assistant that knows all of it.',
    },
    description: {
      zh: 'Semestra 是给大学生用的学期规划工具。建好学业项目，加上学期和课程，其余的都会自动连起来：成绩簿算出当前成绩和期末需要考多少，日历知道你的讲座、实验和考试，截止日期变成待办，内置助手 Sem 可以用自然语言查看和修改这一切。这个仓库是 Semestra 的从零重写版。每个功能都是一个声明了类型化 capability 的模块，所以同一个操作在界面里、在助手里、在插件里、通过 MCP 都能用。',
      en: 'Semestra is a semester planner for university students. Set up your program once, add terms and courses, and Semestra keeps the rest connected: the gradebook works out your current mark and what you need on the final, the calendar knows your lectures, labs and exams, deadlines turn into tasks, and Sem, the built-in assistant, can read and update all of it in plain language. This repository is a ground-up rewrite of the original Semestra. Every feature is a module that declares typed capabilities, so the same operation is available in the UI, to the assistant, to plugins and over MCP.',
    },
    repository: {
      owner: 'jinyuanZhou-Leo',
      name: 'Semestra-Next',
    },
    openSource: true,
    visual: {
      kind: 'image',
      src: {
        zh: '/images/projects/semestra-next-grades-zh.webp',
        en: '/images/projects/semestra-next-grades-en.webp',
      },
      alt: {
        zh: 'Semestra 的课程成绩簿：考核列表、分类平均分、当前成绩，以及达到目标 GPA 所需的分数',
        en: 'A course gradebook in Semestra: assessments, category averages, the current mark and the score needed to reach a target GPA',
      },
      width: 2160,
      height: 1350,
    },
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
      zh: '把学校 LMS 课表导出为日历',
      en: 'School LMS timetable to calendar',
    },
    description: {
      zh: '通过 Python 爬虫与网络库读取学校 LMS 数据，自动生成可导入的课程日历。优化解析逻辑，实现最高 2 倍速度提升，日历文件体积减少 50% 以上，方便同学把课表导入日历。',
      en: 'Fetched and processed school LMS data with Python web crawling and networking libraries to generate importable calendars. Optimized parsing for up to 2× speed and over 50% smaller files, so students could import their timetables more easily.',
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
      zh: '大模型思维链中的自我验证',
      en: 'Self-verification in LLM chain-of-thought',
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
    end: '2029',
    expected: true,
    gpa: '3.84 / 4.00',
  },
];

export const skills: readonly string[] = [
  'Rust',
  'Python',
  'C/C++',
  'Verilog',
  'HTML',
  'CSS',
  'JavaScript',
  'FastAPI',
  'PyTorch',
  'Git',
  'SQLAlchemy',
  'MQTT',
];
