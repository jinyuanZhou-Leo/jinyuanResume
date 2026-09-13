import type { Locale, Project } from '../../data/types';
import { content } from '../../data/resume';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import ProjectCard from './ProjectCard';

export default function SelectedWorkStack({
  locale,
  projects,
}: {
  locale: Locale;
  projects: readonly Project[];
}) {
  const t = content[locale].projects;
  return (
    <ScrollStack
      className="selected-work-stack"
      itemDistance={90}
      itemStackDistance={26}
      stackPosition="20%"
      scaleEndPosition="10%"
      baseScale={0.88}
      previousLabel={t.previous}
      nextLabel={t.next}
    >
      {projects.map((project, index) => (
        <ScrollStackItem
          key={project.id}
          id={project.id}
          itemClassName={
            project.visual
              ? 'featured-project'
              : 'project-row stack-project-row'
          }
        >
          <ProjectCard project={project} locale={locale} index={index} />
        </ScrollStackItem>
      ))}
    </ScrollStack>
  );
}
