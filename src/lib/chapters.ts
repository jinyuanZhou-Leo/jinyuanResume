import { animate, scroll } from 'motion';

/** Establish the heading, bring the evidence into focus, then release the scene. */
export function mountChapters() {
  const experience = document.querySelector<HTMLElement>('#experience');
  const layout = experience?.querySelector<HTMLElement>('.experience-layout');
  if (!experience || !layout) return () => {};

  const lines = [
    ...layout.querySelectorAll<HTMLElement>(
      ':scope > div > *, .experience-detail > p, .experience-detail > h3, .experience-detail > ul:not(.tags) > li, .experience-detail > .tags',
    ),
  ];
  // Reveal semantic lines in reading order without splitting responsive text nodes.
  // The last line settles at the matching 0.56 snap stop in snap-timeline.ts.
  const animations = lines.map((line, index) =>
    animate(
      line,
      {
        opacity: [0, 0, 1, 1],
        y: [28, 28, 0, 0],
      },
      {
        times: [
          0,
          0.08 + (index / Math.max(1, lines.length - 1)) * 0.4,
          0.16 + (index / Math.max(1, lines.length - 1)) * 0.4,
          1,
        ],
        ease: ['linear', [0.22, 1, 0.36, 1], 'linear'],
        autoplay: false,
      },
    ),
  );
  const release = animate(
    layout,
    {
      opacity: [1, 1, 0],
      scale: [1, 1, 0.9],
      y: [0, 0, -36],
    },
    {
      times: [0, 0.86, 1],
      ease: ['linear', 'easeInOut'],
      autoplay: false,
    },
  );
  animations.push(release);
  const stop = scroll(
    (progress: number) => {
      animations.forEach((animation) => {
        animation.time = progress * animation.duration;
      });
    },
    { target: experience, offset: ['start 80%', 'end end'] },
  );
  return () => {
    stop();
    animations.forEach((animation) => animation.cancel());
  };
}
