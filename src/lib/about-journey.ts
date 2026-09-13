import { scroll, interpolate, cubicBezier } from 'motion';

/** All layers share one scroll clock, so reversing direction retraces the same journey. */
export function mountAboutJourney() {
  const root = document.querySelector<HTMLElement>('#about');
  if (!root) return () => {};

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

  // Share the University of Toronto card's fade-out window.
  fade('.journey-intro', [0, 0.37, 0.44, 1], [1, 1, 0, 0]);
  track('.journey-intro', [0, 0.37, 0.44, 1], [0, 0, 1, 1], (el, v) => {
    el.style.filter = `blur(${v * 6}px)`;
    el.style.transform = `scale(${1 - v * 0.035})`;
  });
  // Each school passes the same reading position before the line becomes the toolkit axis.
  move(
    '.journey-education',
    [0, 0.12, 0.2, 0.29, 0.37, 0.46, 1],
    [12, 0, 0, -38, -38, -112, -112],
  );
  fade(
    '.journey-school:first-child',
    [0, 0.11, 0.17, 0.25, 0.32, 1],
    [0, 1, 1, 1, 0, 0],
  );
  fade(
    '.journey-school:last-child',
    [0, 0.24, 0.3, 0.37, 0.44, 0.48, 1],
    [0, 0, 1, 1, 0, 0, 0],
  );
  const line = root.querySelector<HTMLElement>('.journey-line');
  const lineTitle = root.querySelector<HTMLElement>(
    '.journey-toolkit-title h3',
  );
  let toolkitGap = 14;
  const refreshToolkitGap = () => {
    if (!line || !lineTitle) return;
    // The split follows the actual heading width, so CJK and Latin titles share the same rhythm.
    const lineWidth = line.offsetWidth || 1;
    const headingWidth = lineTitle.offsetWidth;
    toolkitGap = Math.min(
      28,
      Math.max(9, ((headingWidth + 64) / lineWidth) * 50),
    );
  };
  refreshToolkitGap();
  const gapObserver =
    typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(refreshToolkitGap)
      : null;
  if (gapObserver && line && lineTitle) {
    gapObserver.observe(line);
    gapObserver.observe(lineTitle);
  }
  track(
    '.journey-line',
    [0, 0.12, 0.34, 0.52, 0.6, 1],
    [0.25, 1, 1, 1, 0.36, 0.36],
    (el, v) => el.style.setProperty('--line-scale', String(v)),
  );
  track('.journey-line', [0, 0.46, 0.56, 1], [0, 0, 90, 90], (el, v) =>
    el.style.setProperty('--line-angle', `${v}deg`),
  );
  const toolkitGapPhase = interpolate(
    [0, 0.41, 0.47, 0.53, 0.58, 1],
    [0, 0, 1, 1, 0, 0],
    { ease },
  );
  tracks.push((p) =>
    line?.style.setProperty(
      '--line-gap',
      `${toolkitGap * toolkitGapPhase(p)}%`,
    ),
  );
  fade('.journey-toolkit', [0, 0.41, 0.47, 0.53, 0.58, 1], [0, 0, 1, 1, 0, 0]);
  // Depth changes keep the reading anchor fixed instead of sliding whole panels away.
  track(
    '.journey-toolkit-title',
    [0, 0.41, 0.47, 0.53, 0.58, 1],
    [1, 1, 0, 0, 1, 1],
    (el, v) => {
      el.style.transform = `scale(${1 - v * 0.08})`;
      el.style.filter = `blur(${v * 7}px)`;
    },
  );
  root.querySelectorAll('.journey-icon').forEach((_, i) => {
    const selector = `.journey-icon:nth-child(${i + 1})`;
    fade(selector, [0, 0.42 + i * 0.005, 0.48 + i * 0.005, 1], [0, 0, 1, 1]);
    track(
      selector,
      [0, 0.43, 0.5, 0.54, 0.59, 1],
      [24, 24, 0, 0, -18, -18],
      (el, v) => {
        el.style.transform = `translate(-50%, -50%) translate(${v * (i % 2 ? -1 : 1)}px, ${v * (i < 5 ? -1 : 1)}px)`;
      },
    );
  });

  fade('.journey-people', [0, 0.58, 0.62, 1], [0, 0, 1, 1]);
  const abilities = [...root.querySelectorAll<HTMLElement>('.journey-ability')];
  // Extended dwell times for all 5 ability items so each point can be comfortably read.
  const focus = interpolate(
    [
      0.6,
      0.65, // Item 0 dwell
      0.68, // Transition
      0.7,
      0.75, // Item 1 dwell
      0.78, // Transition
      0.8,
      0.85, // Item 2 dwell
      0.88, // Transition
      0.9,
      0.94, // Item 3 dwell
      0.96, // Transition
      0.97,
      1.0, // Item 4 dwell
    ],
    [0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4],
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
    gapObserver?.disconnect();
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
