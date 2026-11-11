import type { Locale, Project, ProjectVisual } from '../../data/types';
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

function Artwork({
  visual,
  project,
  locale,
}: {
  visual: ProjectVisual | undefined;
  project: Project;
  locale: Locale;
}) {
  if (!visual)
    return (
      <div className="monogram">
        <BrandIcon name={project.tags[0] ?? ''} size={84} />
        <span className="monogram-name" aria-hidden="true">
          {project.name}
        </span>
      </div>
    );
  if (visual.kind === 'terminal')
    return (
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
    );
  if (visual.kind === 'reversi')
    return (
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
    );
  return (
    <figure className="screenshot-window">
      <img
        src={visual.src[locale]}
        alt={visual.alt[locale]}
        width={visual.width}
        height={visual.height}
        loading="lazy"
        decoding="async"
      />
    </figure>
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
  return (
    <article className="project-card">
      <div
        className={`project-visual ${visual?.kind ?? 'monogram'}-visual`}
        style={
          project.tone
            ? ({ '--visual-tone': project.tone } as Record<string, string>)
            : undefined
        }
      >
        <span className="visual-index">
          {String(index + 1).padStart(2, '0')} / {project.category[locale]}
        </span>
        <div className="project-artwork">
          <Artwork visual={visual} project={project} locale={locale} />
        </div>
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
              data-magnetic
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
    </article>
  );
}
