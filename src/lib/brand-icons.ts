import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import {
  siC,
  siCss,
  siFastapi,
  siGit,
  siHtml5,
  siJavascript,
  siMqtt,
  siPytorch,
  siPython,
  siQdrant,
  siReact,
  siRos,
  siRust,
  siSqlite,
  siTailwindcss,
} from 'simple-icons';
import type { SimpleIcon } from 'simple-icons';

export interface BrandIconData {
  paths: string[];
  viewBox: string;
}

const technologies: Record<string, SimpleIcon> = {
  Python: siPython,
  Rust: siRust,
  C: siC,
  HTML: siHtml5,
  CSS: siCss,
  JavaScript: siJavascript,
  Git: siGit,
  PyTorch: siPytorch,
  FastAPI: siFastapi,
  React: siReact,
  'React 19': siReact,
  'Tailwind CSS': siTailwindcss,
  SQLite: siSqlite,
  'Qdrant / RAG': siQdrant,
  MQTT: siMqtt,
  'ROS 2': siRos,
};

const platforms = {
  GitHub: faGithub,
  LinkedIn: faLinkedin,
};

/** Resolve the maintained brand path data used by both Astro and React icons. */
export function getBrandIcon(name: string): BrandIconData | undefined {
  const platform = platforms[name as keyof typeof platforms];
  if (platform) {
    const [width, height, , , iconPath] = platform.icon;
    const paths = typeof iconPath === 'string' ? [iconPath] : iconPath;
    return {
      paths,
      viewBox: `0 0 ${width} ${height}`,
    };
  }

  const technology = technologies[name];
  if (!technology) return undefined;

  return {
    paths: [technology.path],
    viewBox: '0 0 24 24',
  };
}
