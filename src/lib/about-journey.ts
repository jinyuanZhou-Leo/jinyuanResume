import { scroll, interpolate, cubicBezier } from 'motion';

/** All layers share one scroll clock, so reversing direction retraces the same journey. */
export function mountAboutJourney() {
  const root = document.querySelector<HTMLElement>('#about')!;
  const ease = cubicBezier(0.22, 1, 0.36, 1);
  const tracks: Array<(p: number) => void> = [];
  const styled = new Set<HTMLElement>();
  const track = (
    selector: string,
    times: number[],
    values: number[],
    render: (el: HTMLElement, value: number) => void,
  ) => {
    const elements = [...root.querySelectorAll<HTMLElement>(selector)];
    const value = interpolate(times, values, { ease });
    elements.forEach((el) => styled.add(el));
    tracks.push((p) => elements.forEach((el) => render(el, value(p))));
  };
  const fade = (selector: string, times: number[], values: number[]) =>
    track(selector, times, values, (el, v) => {
      el.style.opacity = String(v);
    });
  const move = (
    selector: string,
    times: number[],
    values: number[],
    axis = 'X',
  ) =>
    track(selector, times, values, (el, v) => {
      el.style.transform = `translate${axis}(${v}%)`;
    });

  fade('.journey-heading, .journey-bio', [0, 0.23, 0.34, 1], [1, 1, 0, 0]);
  track(
    '.journey-heading, .journey-bio',
    [0, 0.23, 0.35, 1],
    [0, 0, 1, 1],
    (el, v) => {
      el.style.filter = `blur(${v * 6}px)`;
      el.style.transform = `scale(${1 - v * 0.035})`;
    },
  );
  // Each school passes the same reading position before the line becomes the toolkit axis.
  move(
    '.journey-education',
    [0, 0.08, 0.14, 0.23, 0.29, 0.4, 1],
    [12, 0, 0, -50, -50, -120, -120],
  );
  fade(
    '.journey-school:first-child',
    [0, 0.02, 0.15, 0.23, 1],
    [0, 1, 1, 0, 0],
  );
  fade(
    '.journey-school:last-child',
    [0, 0.13, 0.22, 0.3, 0.4, 1],
    [0, 0, 1, 1, 0, 0],
  );
  track(
    '.journey-line',
    [0, 0.1, 0.35, 0.58, 0.68, 1],
    [0.25, 1, 1, 1, 0.36, 0.36],
    (el, v) => el.style.setProperty('--line-scale', String(v)),
  );
  track('.journey-line', [0, 0.58, 0.69, 1], [0, 0, 90, 90], (el, v) =>
    el.style.setProperty('--line-angle', `${v}deg`),
  );
  track(
    '.journey-line',
    [0, 0.29, 0.4, 0.56, 0.68, 1],
    [0, 0, 22, 22, 0, 0],
    (el, v) => el.style.setProperty('--line-gap', `${v}%`),
  );
  fade('.journey-toolkit', [0, 0.29, 0.38, 0.57, 0.67, 1], [0, 0, 1, 1, 0, 0]);
  // Depth changes keep the reading anchor fixed instead of sliding whole panels away.
  track(
    '.journey-toolkit-title',
    [0, 0.3, 0.41, 0.56, 0.68, 1],
    [1, 1, 0, 0, 1, 1],
    (el, v) => {
      el.style.transform = `scale(${1 - v * 0.08})`;
      el.style.filter = `blur(${v * 7}px)`;
    },
  );
  root.querySelectorAll('.journey-icon').forEach((_, i) => {
    const selector = `.journey-icon:nth-child(${i + 1})`;
    fade(selector, [0, 0.31 + i * 0.008, 0.4 + i * 0.008, 1], [0, 0, 1, 1]);
    track(
      selector,
      [0, 0.32, 0.49, 0.6, 0.67, 1],
      [24, 24, 0, 0, -18, -18],
      (el, v) => {
        el.style.transform = `translate(-50%, -50%) translate(${v * (i % 2 ? -1 : 1)}px, ${v * (i < 5 ? -1 : 1)}px)`;
      },
    );
  });

  fade('.journey-people', [0, 0.63, 0.7, 1], [0, 0, 1, 1]);
  const abilities = [...root.querySelectorAll<HTMLElement>('.journey-ability')];
  // A continuous vertical queue retains neighbours; only the focal item is fully sharp.
  const focus = interpolate(
    [0.68, 0.72, 0.755, 0.78, 0.815, 0.84, 0.875, 0.9, 0.935, 0.96, 1],
    [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4],
    { ease },
  );
  abilities.forEach((el, i) => {
    styled.add(el);
    tracks.push((p) => {
      const distance = i - focus(p);
      const magnitude = Math.abs(distance);
      const alpha = interpolate([0, 1, 2, 2.6], [1, 0.34, 0.12, 0])(magnitude);
      el.style.opacity = String(alpha);
      el.style.transform = `translate3d(0, ${distance * 92}px, 0)`;
      el.style.filter = `blur(${Math.min(magnitude * 1.5, 5)}px)`;
    });
  });
  const dots = [...root.querySelectorAll<HTMLElement>('.learning-dots i')];
  dots.forEach((el) => styled.add(el));
  const stop = scroll(
    (p: number) => {
      root.dataset.journeyProgress = p.toFixed(4);
      tracks.forEach((update) => update(p));
      dots.forEach((el, i) => {
        el.style.opacity = String(0.2 + 0.8 * Math.sin(p * 40 - i) ** 2);
      });
    },
    { target: root, offset: ['start start', 'end end'] },
  );
  return () => {
    stop();
    styled.forEach((el) => {
      // Preserve icon coordinates authored by Astro while removing animation-owned properties.
      [
        'opacity',
        'transform',
        'filter',
        '--line-scale',
        '--line-angle',
        '--line-gap',
      ].forEach((name) => el.style.removeProperty(name));
    });
    delete root.dataset.journeyProgress;
  };
}
