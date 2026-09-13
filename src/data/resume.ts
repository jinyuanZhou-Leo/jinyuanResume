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
  resume: '/documents/Jinyuan_Zhou_CV_2026.pdf',
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
      zh: '个人项目',
      en: 'Personal project',
    },
    tags: ['Rust'],
    title: {
      zh: '从零开始，理解一个 Shell。',
      en: 'A shell. Built from first principles.',
    },
    description: {
      zh: '使用 Rust 从零构建 shell，实现 REPL 交互循环、基础内置命令与外部命令执行。',
      en: 'Built a shell from scratch in Rust, with a REPL, basic built-in commands and external command execution.',
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
      zh: '在 APS105 课程 440 名学生的提交中排名第 2。构建可自主评估棋盘并选择最优落子的 AI，结合极小极大搜索、迭代加深、走法排序和 Alpha–beta 剪枝，在固定时限内探索更深的博弈树。',
      en: 'Ranked 2nd among submissions from 440 students in APS105. Built an AI to evaluate board positions and select optimal moves, using minimax, iterative deepening, move ordering and alpha–beta pruning for deeper search within a fixed time limit.',
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
      zh: '2025.11 — 2026.04 · 个人项目 · 开发者',
      en: 'NOV 2025 — APR 2026 · Personal project · Developer',
    },
    tags: ['React', 'Tailwind CSS', 'FastAPI', 'SQLite'],
    title: {
      zh: '让学业管理，井井有条。',
      en: 'A little more order to student life.',
    },
    description: {
      zh: '构建集成 Canvas LMS 的学业管理平台，使用 React 与 Tailwind CSS 追踪课程和作业；FastAPI 与 SQLite 提供数据持久化及 Canvas API 集成。通过多智能体编排与提示工程，优化 AI 应用开发工作流。',
      en: 'Built a Canvas LMS-integrated academic platform with React and Tailwind CSS for courses and assignments. FastAPI and SQLite handle persistence and Canvas API integration. Applied multi-agent orchestration and prompt engineering to streamline AI application development workflows.',
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
    name: 'LLM CoT Analyzer',
    category: {
      zh: '研究探索',
      en: 'RESEARCH',
    },
    date: {
      zh: 'AP Statistics 12 研究项目',
      en: 'AP Statistics 12 Research Project',
    },
    tags: ['Python'],
    title: {
      zh: '模型，如何反复确认自己？',
      en: 'How do models double-check themselves?',
    },
    description: {
      zh: '设计并开展实验，分析大语言模型规模对思维链中重复自我验证行为的影响。',
      en: 'Designed and conducted experiments to analyze how LLM size affects repetitive self-verification behaviors in chain of thought.',
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
      zh: '华苏科技 · Howso Technology',
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
        en: 'Implemented movement control and audio functions for Unitree G1 / GO2 using MQTT and the Unitree Python SDK.',
      },
      {
        zh: '开发 React 19 + FastAPI 投标分析平台，使用 Qdrant 驱动的 RAG 自动生成响应矩阵。',
        en: 'Developed a React 19 + FastAPI bid analysis platform with Qdrant-powered RAG for automated response matrix generation.',
      },
      {
        zh: '通过 MQTT 通信协议与 ROS 2 机器人框架的实际应用，探索物联网与具身智能技术。',
        en: 'Explored IoT and embodied AI through hands-on work with MQTT communication protocols and ROS 2 robotics frameworks.',
      },
    ],
    tags: ['React 19', 'FastAPI', 'Qdrant / RAG', 'MQTT', 'ROS 2'],
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
    gpa: '3.84',
  },
];

export const skills: readonly string[] = [
  'Python',
  'Rust',
  'C',
  'HTML',
  'CSS',
  'JavaScript',
  'Git',
  'PyTorch',
  'FastAPI',
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
