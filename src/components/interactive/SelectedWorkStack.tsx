import React from 'react';
import {
  siC,
  siFastapi,
  siPython,
  siReact,
  siRust,
  siSqlite,
  siTailwindcss,
} from 'simple-icons';
import type { Locale } from '../../data/resume';
import { profile, projects } from '../../data/resume';
import ScrollStack, { ScrollStackItem } from './ScrollStack';

const technologyIcons = {
  C: siC,
  FastAPI: siFastapi,
  Python: siPython,
  React: siReact,
  Rust: siRust,
  SQLite: siSqlite,
  'Tailwind CSS': siTailwindcss,
} as const;

function BrandIcon({ name, size = 13 }: { name: string; size?: number }) {
  const technology = technologyIcons[name as keyof typeof technologyIcons];
  if (!technology) return null;
  return (
    <svg
      className="brand-icon"
      data-brand={name}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d={technology.path} />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M5 19 19 5M8 5h11v11" />
    </svg>
  );
}

interface SelectedWorkStackProps {
  locale: Locale;
}

const board = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0,
  1, 2, 1, 0, 0, 0, 0, 0, 2, 1, 2, 1, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
];

const SelectedWorkStack: React.FC<SelectedWorkStackProps> = ({ locale }) => {
  const view = locale === 'zh' ? '查看源码' : 'View source';

  return (
    <ScrollStack
      className="selected-work-stack"
      itemDistance={90}
      itemStackDistance={26}
      stackPosition="20%"
      scaleEndPosition="10%"
      baseScale={0.88}
      previousLabel={locale === 'zh' ? '上一个项目' : 'Previous project'}
      nextLabel={locale === 'zh' ? '下一个项目' : 'Next project'}
    >
      {projects.map((project, i) => (
        <ScrollStackItem
          key={project.id}
          id={project.id}
          itemClassName={
            i < 2
              ? 'featured-project'
              : `project-row stack-project-row${i === projects.length - 1 ? ' stack-project-row-last' : ''}`
          }
        >
          {i < 2 ? (
            <>
              <div
                className={`project-visual ${i === 0 ? 'terminal-visual' : 'reversi-visual'}`}
              >
                <span className="visual-index">
                  0{i + 1} / {project.category[locale]}
                </span>
                {i === 0 ? (
                  <div className="terminal-window">
                    <div className="terminal-chrome">
                      <span>jsh</span>
                      <span>— &nbsp; □ &nbsp; ×</span>
                    </div>
                    <div className="terminal-code">
                      <p>
                        <span>~</span> jsh
                      </p>
                      <p className="terminal-muted">
                        {locale === 'zh'
                          ? '从第一行代码开始。'
                          : 'Start with the first line.'}
                      </p>
                      <p>
                        <span>➜</span> echo &quot;Hello, world.&quot;
                      </p>
                      <p>Hello, world.</p>
                      <p>
                        <span>➜</span> <span className="cursor" />
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="board-composition">
                    <div className="reversi-board" aria-hidden="true">
                      {board.map((cell, index) => (
                        <span
                          className="board-cell"
                          key={`${project.id}-${index}`}
                        >
                          {cell > 0 && (
                            <i
                              className={`stone ${cell === 1 ? 'black' : 'white'}`}
                            />
                          )}
                        </span>
                      ))}
                    </div>
                    <div className="rank-label">
                      <strong>
                        2<span>/440</span>
                      </strong>
                      <span>
                        {locale === 'zh'
                          ? 'APS105 · 课程排名'
                          : 'APS105 · COURSE RANK'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="project-details">
                <div className="project-heading">
                  <h3>{project.name}</h3>
                  {project.repo && (
                    <a
                      className="circle-link"
                      href={`https://github.com/${profile.github}/${project.repo}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${view}: ${project.name}`}
                    >
                      <ArrowIcon />
                    </a>
                  )}
                </div>
                <p className="project-tagline">{project.title[locale]}</p>
                <p className="project-description">
                  {project.description[locale]}
                </p>
                <p className="project-date">{project.date[locale]}</p>
                <ul
                  className="tags"
                  aria-label={locale === 'zh' ? '技术' : 'Technologies'}
                >
                  {project.tags.map((tag) => (
                    <li key={tag}>
                      <BrandIcon name={tag} size={13} />
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="project-row-name">
                <div>
                  <p className="eyebrow">{project.category[locale]}</p>
                  <h3>
                    <a
                      href={`https://github.com/${profile.github}/${project.repo}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {project.name}
                      <ArrowIcon />
                    </a>
                  </h3>
                  <p className="project-date">{project.date[locale]}</p>
                </div>
              </div>
              <div>
                <p className="project-description">
                  {project.description[locale]}
                </p>
                <ul className="tags">
                  {project.tags.map((tag) => (
                    <li key={tag}>
                      <BrandIcon name={tag} size={13} />
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </ScrollStackItem>
      ))}
    </ScrollStack>
  );
};

export default SelectedWorkStack;
