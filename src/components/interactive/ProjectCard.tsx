import type { Locale, Project } from '../../data/types';
import { content } from '../../data/resume';
import { repositoryHref } from '../../lib/content';
import BrandIcon from './BrandIcon';

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

function ProjectTags({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  return (
    <ul className="tags" aria-label={content[locale].projects.technologies}>
      {project.tags.map((tag) => (
        <li key={tag}>
          <BrandIcon name={tag} size={13} />
          {tag}
        </li>
      ))}
    </ul>
  );
}

/** Visual identity belongs to the project, independently of ordering or repository access. */
export default function ProjectCard({
  project,
  locale,
  index,
}: {
  project: Project;
  locale: Locale;
  index: number;
}) {
  const visual = project.visual;
  const href = project.repository
    ? repositoryHref(project.repository)
    : undefined;
  const title = href ? (
    <a href={href} target="_blank" rel="noreferrer">
      {project.name}
      <ArrowIcon />
    </a>
  ) : (
    project.name
  );
  if (!visual)
    return (
      <>
        <div className="project-row-name">
          <div>
            <p className="eyebrow">{project.category[locale]}</p>
            <h3>{title}</h3>
            <p className="project-date">{project.date[locale]}</p>
          </div>
        </div>
        <div>
          <p className="project-description">{project.description[locale]}</p>
          <ProjectTags project={project} locale={locale} />
        </div>
      </>
    );
  return (
    <>
      <div className={`project-visual ${visual.kind}-visual`}>
        <span className="visual-index">
          {String(index + 1).padStart(2, '0')} / {project.category[locale]}
        </span>
        {visual.kind === 'terminal' ? (
          <div className="terminal-window">
            <div className="terminal-chrome">
              <span>{visual.command}</span>
              <span>— &nbsp; □ &nbsp; ×</span>
            </div>
            <div className="terminal-code">
              <p>
                <span>~</span> {visual.command}
              </p>
              <p className="terminal-muted">{visual.caption[locale]}</p>
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
              {visual.board.map((cell, i) => (
                <span className="board-cell" key={i}>
                  {cell > 0 && (
                    <i className={`stone ${cell === 1 ? 'black' : 'white'}`} />
                  )}
                </span>
              ))}
            </div>
            <div className="rank-label">
              <strong>
                {visual.rank}
                <span>/{visual.total}</span>
              </strong>
              <span>{visual.caption[locale]}</span>
            </div>
          </div>
        )}
      </div>
      <div className="project-details">
        <div className="project-heading">
          <h3>{project.name}</h3>
          {href && (
            <a
              className="circle-link"
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${content[locale].projects.view}: ${project.name}`}
            >
              <ArrowIcon />
            </a>
          )}
        </div>
        <p className="project-tagline">{project.title[locale]}</p>
        <p className="project-description">{project.description[locale]}</p>
        <p className="project-date">{project.date[locale]}</p>
        <ProjectTags project={project} locale={locale} />
      </div>
    </>
  );
}
