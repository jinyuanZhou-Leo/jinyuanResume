import { animate, scroll, interpolate, cubicBezier } from 'motion';

/** Scroll selects a reading beat; Motion completes the transition independently. */
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
    [0, 0.08, 0.17, 0.28, 0.36, 0.48, 1],
    [12, 0, 0, -38, -38, -112, -112],
  );
  fade(
    '.journey-school:first-child',
    [0, 0.03, 0.12, 0.25, 0.35, 1],
    [0, 1, 1, 1, 0, 0],
  );
  fade(
    '.journey-school:last-child',
    [0, 0.18, 0.3, 0.4, 0.49, 0.54, 1],
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
    [0, 0.1, 0.35, 0.64, 0.7, 1],
    [0.25, 1, 1, 1, 0.36, 0.36],
    (el, v) => el.style.setProperty('--line-scale', String(v)),
  );
  track('.journey-line', [0, 0.64, 0.7, 1], [0, 0, 90, 90], (el, v) =>
    el.style.setProperty('--line-angle', `${v}deg`),
  );
  const toolkitGapPhase = interpolate(
    [0, 0.47, 0.55, 0.64, 0.72, 1],
    [0, 0, 1, 1, 0, 0],
    { ease },
  );
  tracks.push((p) =>
    line?.style.setProperty(
      '--line-gap',
      `${toolkitGap * toolkitGapPhase(p)}%`,
    ),
  );
  fade('.journey-toolkit', [0, 0.48, 0.55, 0.64, 0.72, 1], [0, 0, 1, 1, 0, 0]);
  // Depth changes keep the reading anchor fixed instead of sliding whole panels away.
  track(
    '.journey-toolkit-title',
    [0, 0.48, 0.55, 0.64, 0.72, 1],
    [1, 1, 0, 0, 1, 1],
    (el, v) => {
      el.style.transform = `scale(${1 - v * 0.08})`;
      el.style.filter = `blur(${v * 7}px)`;
    },
  );
  root.querySelectorAll('.journey-icon').forEach((_, i) => {
    const selector = `.journey-icon:nth-child(${i + 1})`;
    fade(selector, [0, 0.49 + i * 0.006, 0.57 + i * 0.006, 1], [0, 0, 1, 1]);
    track(
      selector,
      [0, 0.5, 0.6, 0.68, 0.74, 1],
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
  // These are complete reading states, never a partially rotated line or faded title.
  const beats = [0.12, 0.36, 0.63, 0.72, 0.78, 0.84, 0.9, 0.96];
  const thresholds = [0.2, 0.44, 0.68, 0.75, 0.81, 0.87, 0.93];
  let activeBeat = -1;
  let renderedProgress = beats[0];
  let transition: ReturnType<typeof animate> | undefined;
  const render = (p: number) => {
    renderedProgress = p;
    root.dataset.journeyProgress = p.toFixed(4);
    tracks.forEach((update) => update(p));
    dots.forEach((el, i) => {
      el.style.opacity = String(0.2 + 0.8 * Math.sin(p * 40 - i) ** 2);
    });
  };
  const stop = scroll(
    (p: number) => {
      // A small dead band prevents trackpad jitter from toggling adjacent beats.
      let next = activeBeat < 0 ? 0 : activeBeat;
      while (next < thresholds.length && p > thresholds[next] + 0.008) next++;
      while (next > 0 && p < thresholds[next - 1] - 0.008) next--;
      if (next === activeBeat) return;
      transition?.stop();
      const initial = activeBeat < 0;
      activeBeat = next;
      if (initial) {
        render(beats[next]);
        return;
      }
      transition = animate(renderedProgress, beats[next], {
        duration: next < 4 ? 1.1 : 0.65,
        ease: 'easeInOut',
        onUpdate: render,
      });
    },
    { target: root, offset: ['start start', 'end end'] },
  );
  return () => {
    stop();
    transition?.stop();
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
