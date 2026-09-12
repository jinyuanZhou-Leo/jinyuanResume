import { animate, scroll } from 'motion';

/** Keep the headline and evidence on one reversible vertical timeline. */
export function mountChapters() {
  const experience = document.querySelector<HTMLElement>('#experience');
  const layout = experience?.querySelector<HTMLElement>('.experience-layout');
  if (!experience || !layout) return () => {};

  // Animate their common parent so copy and UI never drift apart.
  const animation = animate(
    layout,
    { opacity: [0, 1, 1, 0], y: [72, 0, 0, -72] },
    { times: [0, 0.18, 0.86, 1], ease: 'linear', autoplay: false },
  );
  const stop = scroll(
    (progress: number) => {
      animation.time = progress * animation.duration;
    },
    { target: experience, offset: ['start 80%', 'end end'] },
  );
  return () => {
    stop();
    animation.cancel();
  };
}
