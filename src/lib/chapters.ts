import { animate, scroll } from 'motion';

/** One reversible scroll timeline coordinates each chapter's headline and evidence. */
export function mountChapters() {
  const experience = document.querySelector<HTMLElement>('#experience');
  if (!experience) return () => {};
  const disposers: (() => void)[] = [];
  const heading = animate(
    '.experience-layout > div:first-child',
    {
      opacity: [0.2, 1, 1, 0.75],
      y: [100, 0, 0, -45],
      scale: [1.08, 1, 1, 0.98],
    },
    { times: [0, 0.18, 0.85, 1], ease: 'linear', autoplay: false },
  );
  const summary = animate(
    '.experience-detail > p, .experience-detail > h3',
    {
      opacity: [0, 1, 1],
      x: [100, 0, 0],
    },
    { times: [0, 0.25, 1], ease: 'linear', autoplay: false },
  );
  const points = [
    ...experience.querySelectorAll<HTMLElement>(
      '.experience-detail > ul:not(.tags) li',
    ),
  ].map((item, i) => {
    item.setAttribute('data-reading-reveal', '');
    return animate(
      item,
      {
        opacity: [0, 0, 1, 1],
        x: [140, 140, 0, 0],
        scale: [0.94, 0.94, 1, 1],
        filter: ['blur(6px)', 'blur(6px)', 'blur(0px)', 'blur(0px)'],
      },
      {
        times: [0, 0.2 + i * 0.14, 0.38 + i * 0.14, 1],
        ease: 'linear',
        autoplay: false,
      },
    );
  });
  const tags = animate(
    '.experience-detail > .tags',
    { opacity: [0, 0, 1, 1], y: [25, 25, 0, 0] },
    { times: [0, 0.65, 0.8, 1], ease: 'linear', autoplay: false },
  );
  const experienceAnimations = [heading, summary, ...points, tags];
  experienceAnimations.forEach((animation) =>
    disposers.push(() => animation.cancel()),
  );
  disposers.push(
    scroll(
      (progress: number) => {
        experienceAnimations.forEach((animation) => {
          animation.time = progress * animation.duration;
        });
      },
      { target: experience, offset: ['start 80%', 'end end'] },
    ),
  );

  return () =>
    disposers
      .splice(0)
      .reverse()
      .forEach((dispose) => dispose());
}
