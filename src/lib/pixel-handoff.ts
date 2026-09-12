import { scroll } from 'motion';

/** Crossfade and scale the chapter wrappers; Pixel Blast keeps its own effect. */
export function mountPixelHandoff() {
  const about = document.querySelector<HTMLElement>('#about');
  const github = document.querySelector<HTMLElement>('#github');
  const outgoing = about?.querySelector<HTMLElement>(':scope > .scene-stage');
  const incoming = github?.querySelector<HTMLElement>(':scope > .scene-stage');
  if (!about || !github || !outgoing || !incoming) return () => {};

  let start = 0;
  let end = 1;
  let lastPhase = '';
  const render = () => {
    const progress = Math.max(
      0,
      Math.min(1, (window.scrollY - start) / (end - start)),
    );
    const phase =
      progress === 0 ? 'before' : progress === 1 ? 'after' : 'active';
    if (phase !== lastPhase) {
      about.dataset.pixelHandoff = phase;
      github.dataset.pixelHandoff = phase;
      lastPhase = phase;
    }
    const ease = (value: number) => {
      const t = Math.max(0, Math.min(1, value));
      return t * t * (3 - 2 * t);
    };
    const leave = ease(progress / 0.75);
    const enter = ease((progress - 0.15) / 0.85);
    // Transform content, not the measured stage, to keep scroll geometry stable.
    about.style.setProperty('--handoff-opacity', String(1 - leave));
    about.style.setProperty('--handoff-scale', String(1 - leave * 0.08));
    github.style.setProperty('--handoff-opacity', String(enter));
    github.style.setProperty('--handoff-scale', String(0.9 + enter * 0.1));
    github.style.setProperty(
      '--handoff-copy',
      String(Math.max(0, Math.min(1, (progress - 0.45) / 0.45))),
    );
    outgoing.inert = progress === 1;
    incoming.inert = progress < 1;
  };
  const measure = () => {
    const navHeight =
      document.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 0;
    // Fractional text heights must not shift the boundary when stages leave flow.
    about.style.setProperty(
      '--handoff-scene-height',
      `${Math.ceil(outgoing.getBoundingClientRect().height)}px`,
    );
    github.style.setProperty(
      '--handoff-scene-height',
      `${Math.ceil(incoming.getBoundingClientRect().height)}px`,
    );
    const githubTop = github.getBoundingClientRect().top + window.scrollY;
    start = githubTop - window.innerHeight;
    end = githubTop - navHeight;
    const height = window.innerHeight - navHeight;
    about.style.setProperty(
      '--handoff-outgoing-top',
      `${window.innerHeight - outgoing.offsetHeight}px`,
    );
    // Both origins coincide with the visible viewport center, even for tall mobile copy.
    about.style.setProperty(
      '--handoff-origin-y',
      `${outgoing.offsetHeight - height / 2}px`,
    );
    github.style.setProperty('--handoff-origin-y', `${height / 2}px`);
    render();
  };
  // Reserve both scenes before temporarily taking their stages out of flow.
  about.dataset.pixelHandoff = 'before';
  github.dataset.pixelHandoff = 'before';
  measure();
  const observer = new ResizeObserver(measure);
  observer.observe(about);
  observer.observe(outgoing);
  observer.observe(incoming);
  const main = document.querySelector('main');
  if (main) observer.observe(main);
  window.addEventListener('resize', measure);
  const stop = scroll(render);

  return () => {
    stop();
    observer.disconnect();
    window.removeEventListener('resize', measure);
    delete about.dataset.pixelHandoff;
    delete github.dataset.pixelHandoff;
    about.style.removeProperty('--handoff-outgoing-top');
    about.style.removeProperty('--handoff-scene-height');
    github.style.removeProperty('--handoff-scene-height');
    github.style.removeProperty('--handoff-copy');
    for (const scene of [about, github]) {
      ['--handoff-opacity', '--handoff-scale', '--handoff-origin-y'].forEach(
        (name) => scene.style.removeProperty(name),
      );
    }
    outgoing.inert = false;
    incoming.inert = false;
  };
}
