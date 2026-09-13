import { scroll, interpolate, cubicBezier } from 'motion';
import { buildAboutTimeline, type ReadingBeat } from './chapter-timeline';
import { getElementTop, registerScrollStops } from './scroll-stops';
import { progressBetween } from './stack-layout';

export function mountAboutJourney() {
  const root = document.querySelector<HTMLElement>('#about');
  if (!root) return () => {};
  const schools = [...root.querySelectorAll<HTMLElement>('.journey-school')];
  const abilities = [...root.querySelectorAll<HTMLElement>('.journey-ability')];
  const icons = [...root.querySelectorAll<HTMLElement>('.journey-icon')];
  const timeline = buildAboutTimeline(
    schools.length,
    abilities.length,
    icons.length > 0,
  );
  const intro = root.querySelector<HTMLElement>('.journey-intro');
  const education = root.querySelector<HTMLElement>('.journey-education');
  const toolkit = root.querySelector<HTMLElement>('.journey-toolkit');
  const title = root.querySelector<HTMLElement>('.journey-toolkit-title');
  const line = root.querySelector<HTMLElement>('.journey-line');
  const people = root.querySelector<HTMLElement>('.journey-people');
  const dots = [...root.querySelectorAll<HTMLElement>('.learning-dots i')];
  const styled = [
    intro,
    education,
    toolkit,
    title,
    line,
    people,
    ...schools,
    ...abilities,
    ...icons,
    ...dots,
  ].filter((el): el is HTMLElement => !!el);
  const ease = cubicBezier(0.22, 1, 0.36, 1);
  const alpha = (p: number, b: ReadingBeat) =>
    ease(progressBetween(p, b.start, b.enter)) *
    (1 - ease(progressBetween(p, b.leave, b.end)));
  root.style.setProperty('--journey-distance', `${timeline.scrollVh}svh`);
  let gap = 14;
  const measureGap = () => {
    if (line && title)
      gap = Math.min(
        28,
        Math.max(
          9,
          (((title.querySelector('h3')?.offsetWidth ?? 0) + 64) /
            (line.offsetWidth || 1)) *
            50,
        ),
      );
  };
  const observer = new ResizeObserver(measureGap);
  if (line) observer.observe(line);
  if (title) observer.observe(title);
  const educationX = schools.length
    ? interpolate(
        [0, ...timeline.schools.map((b) => b.read), timeline.introEnd],
        [12, ...schools.map((_, i) => (-i / schools.length) * 100), -100],
        { ease },
      )
    : () => 0;
  const focus = abilities.length
    ? interpolate(
        timeline.abilities.flatMap((b) => [b.enter, b.leave]),
        abilities.flatMap((_, i) => [i, i]),
        { ease },
      )
    : () => 0;
  const stop = scroll(
    (p: number) => {
      root.dataset.journeyProgress = p.toFixed(4);
      const introFade = ease(
        progressBetween(
          p,
          timeline.schools.at(-1)?.read ?? 0,
          timeline.introEnd,
        ),
      );
      if (intro) {
        intro.style.opacity = String(1 - introFade);
        intro.style.transform = `scale(${1 - introFade * 0.035})`;
        intro.style.filter = `blur(${introFade * 6}px)`;
      }
      if (education)
        education.style.transform = `translateX(${educationX(p)}%)`;
      schools.forEach(
        (el, i) => (el.style.opacity = String(alpha(p, timeline.schools[i]))),
      );
      const b = timeline.toolkit;
      const visibility = b ? alpha(p, b) : 0;
      if (toolkit) toolkit.style.opacity = String(visibility);
      if (title) {
        title.style.transform = `scale(${0.92 + visibility * 0.08})`;
        title.style.filter = `blur(${(1 - visibility) * 7}px)`;
      }
      icons.forEach((el, i) => {
        const reveal = b
          ? ease(
              progressBetween(
                p,
                b.start + ((b.enter - b.start) * i) / Math.max(1, icons.length),
                b.enter,
              ),
            )
          : 0;
        el.style.opacity = String(reveal);
        el.style.transform = `translate(-50%,-50%) translateY(${(1 - reveal) * 24}px)`;
      });
      if (line) {
        line.style.setProperty('--line-gap', `${gap * visibility}%`);
        line.style.setProperty(
          '--line-angle',
          // Keep the line horizontal throughout the toolkit's readable hold.
          `${b ? ease(progressBetween(p, b.leave, b.end)) * 90 : 0}deg`,
        );
        line.style.setProperty(
          '--line-scale',
          String(
            1 -
              0.64 *
                ease(
                  progressBetween(
                    p,
                    b?.leave ?? timeline.introEnd,
                    b?.end ?? 1,
                  ),
                ),
          ),
        );
      }
      if (people)
        people.style.opacity = String(
          abilities.length
            ? ease(
                progressBetween(
                  p,
                  timeline.abilities[0].start,
                  timeline.abilities[0].enter,
                ),
              )
            : 0,
        );
      abilities.forEach((el, i) => {
        const distance = i - focus(p);
        const magnitude = Math.abs(distance);
        el.style.opacity = String(Math.max(0, 1 - magnitude * 0.66));
        el.style.transform = `translate3d(0,${distance * 92}px,0)`;
        el.style.filter = `blur(${Math.min(magnitude * 1.5, 5)}px)`;
      });
      dots.forEach(
        (el, i) =>
          (el.style.opacity = String(0.2 + 0.8 * Math.sin(p * 40 - i) ** 2)),
      );
    },
    { target: root, offset: ['start start', 'end end'] },
  );
  const unregister = registerScrollStops(root, () =>
    timeline.stops.map(
      (p) =>
        getElementTop(root) +
        Math.max(0, root.offsetHeight - window.innerHeight) * p,
    ),
  );
  return () => {
    stop();
    observer.disconnect();
    unregister();
    styled.forEach((el) =>
      [
        'opacity',
        'transform',
        'filter',
        '--line-gap',
        '--line-angle',
        '--line-scale',
      ].forEach((property) => el.style.removeProperty(property)),
    );
    root.style.removeProperty('--journey-distance');
    delete root.dataset.journeyProgress;
  };
}
