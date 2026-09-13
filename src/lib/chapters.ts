import { animate, scroll } from 'motion';
import { buildExperienceTimeline } from './chapter-timeline';
import { getElementTop, registerScrollStops } from './scroll-stops';

/** Each experience gets its own sequential reveal and readable hold. */
export function mountChapters() {
  const scene = document.querySelector<HTMLElement>('#experience');
  const layout = scene?.querySelector<HTMLElement>('.experience-layout');
  if (!scene || !layout) return () => {};
  const entries = [
    ...layout.querySelectorAll<HTMLElement>('.experience-detail'),
  ];
  const lines = entries.map((entry) => [
    ...entry.querySelectorAll<HTMLElement>(
      ':scope > p, :scope > h3, :scope > ul:not(.tags) > li, :scope > .tags',
    ),
  ]);
  const timeline = buildExperienceTimeline(lines.map((items) => items.length));
  scene.style.setProperty('--experience-distance', `${timeline.scrollVh}svh`);
  const animations = [
    ...layout.querySelectorAll<HTMLElement>('.experience-heading > *'),
  ].map((el, i) =>
    animate(
      el,
      { opacity: [0, 1, 1], y: [28, 0, 0] },
      { times: [0, 0.06 + i * 0.025, 1], ease: 'linear', autoplay: false },
    ),
  );
  lines.forEach((items, index) => {
    items.forEach((line, i) => {
      const interval = timeline.entries[index].lines[i];
      animations.push(
        animate(
          line,
          { opacity: [0, 0, 1, 1], y: [28, 28, 0, 0] },
          {
            times: [0, interval.start, interval.end, 1],
            ease: ['linear', [0.22, 1, 0.36, 1], 'linear'],
            autoplay: false,
          },
        ),
      );
    });
    if (index < entries.length - 1) {
      const b = timeline.entries[index];
      animations.push(
        animate(
          entries[index],
          { opacity: [1, 1, 0, 0] },
          { times: [0, b.leave, b.end, 1], ease: 'linear', autoplay: false },
        ),
      );
    }
  });
  animations.push(
    animate(
      layout,
      { opacity: [1, 1, 0], scale: [1, 1, 0.9], y: [0, 0, -36] },
      {
        times: [0, timeline.releaseStart, 1],
        ease: ['linear', 'easeInOut'],
        autoplay: false,
      },
    ),
  );
  const stop = scroll(
    (p: number) =>
      animations.forEach((a) => {
        a.time = p * a.duration;
      }),
    { target: scene, offset: ['start 80%', 'end end'] },
  );
  const unregister = registerScrollStops(scene, () => {
    const start = getElementTop(scene) - window.innerHeight * 0.8;
    const distance = scene.offsetHeight - window.innerHeight * 0.2;
    return timeline.stops.map((p) => start + distance * p);
  });
  return () => {
    stop();
    unregister();
    animations.forEach((a) => a.cancel());
    scene.style.removeProperty('--experience-distance');
  };
}
