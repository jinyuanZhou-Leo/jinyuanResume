import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { clamp, scatter } from './math';
import { duration, ease, stagger } from './tokens';
import type { Cleanup } from './types';

/**
 * Education as a timeline you scroll through: a marker travels the rail,
 * carrying the year, and each school opens as the marker reaches its node.
 * The GPA counts up when its school opens.
 */
function mountEducation(desktop: boolean): Cleanup {
  const block = document.querySelector<HTMLElement>('.about-education');
  const fill = block?.querySelector<HTMLElement>('.education-rail > span');
  const marker = block?.querySelector<HTMLElement>('.education-marker');
  const label = marker?.querySelector<HTMLElement>('.education-year');
  const schools = block
    ? [...block.querySelectorAll<HTMLElement>('.school')]
    : [];
  if (!block || !fill || !marker || !schools.length) return () => {};

  const axis = desktop ? 'x' : 'y';
  const finalYear = Number(block.dataset.finalYear);
  const years = schools.map((school) => Number(school.dataset.year));
  // Where each node sits along the rail, as a fraction of its length.
  let stops: number[] = [];
  let length = 0;
  const measure = () => {
    const box = block.getBoundingClientRect();
    length = desktop ? box.width : box.height;
    stops = schools.map((school) => {
      const node = school.querySelector<HTMLElement>('.school-node');
      const rect = (node ?? school).getBoundingClientRect();
      const offset = desktop
        ? rect.left + rect.width / 2 - box.left
        : rect.top + rect.height / 2 - box.top;
      return length ? clamp(offset / length, 0, 1) : 0;
    });
  };

  // Year shown on the marker: piecewise between the schools' own years.
  const yearAt = (progress: number) => {
    const points = [...stops.map((stop, i) => [stop, years[i]]), [1, finalYear]]
      .filter(([, year]) => Number.isFinite(year))
      .sort((a, b) => a[0] - b[0]);
    if (!points.length) return '';
    if (progress <= points[0][0]) return String(points[0][1]);
    for (let i = 1; i < points.length; i++) {
      const [x0, y0] = points[i - 1];
      const [x1, y1] = points[i];
      if (progress <= x1)
        return String(
          Math.round(y0 + ((y1 - y0) * (progress - x0)) / (x1 - x0 || 1)),
        );
    }
    return String(points[points.length - 1][1]);
  };

  const openings = schools.map((school) => {
    const parts = [...school.children].filter(
      (child) => !child.matches('.school-node'),
    );
    const timeline = gsap.timeline({ paused: true }).fromTo(
      parts,
      { y: 34, autoAlpha: 0, clipPath: 'inset(0 0 100% 0)' },
      {
        y: 0,
        autoAlpha: 1,
        clipPath: 'inset(0 0 0% 0)',
        duration: duration.slower,
        ease: ease.enter,
        stagger: stagger.loose,
      },
    );
    const count = school.querySelector<HTMLElement>('[data-count]');
    if (count) {
      const target = Number(count.dataset.count);
      const rest = (count.textContent ?? '').replace(count.dataset.count!, '');
      const value = { n: 0 };
      timeline.fromTo(
        value,
        { n: 0 },
        {
          n: target,
          duration: duration.travel,
          ease: ease.travel,
          onUpdate: () => {
            count.textContent = `${value.n.toFixed(2)}${rest}`;
          },
        },
        0.3,
      );
    }
    return timeline;
  });

  const setMarker = gsap.quickSetter(marker, axis, 'px');
  let reached = schools.map(() => false);
  const render = (progress: number) => {
    setMarker(progress * length);
    if (label) label.textContent = yearAt(progress);
    stops.forEach((stop, i) => {
      const now = progress > 0 && progress >= stop - 0.001;
      if (now === reached[i]) return;
      reached[i] = now;
      schools[i].classList.toggle('is-reached', now);
      if (now) openings[i].play();
      else openings[i].reverse();
    });
  };

  const counts = [...block.querySelectorAll<HTMLElement>('[data-count]')].map(
    (element) => [element, element.textContent ?? ''] as const,
  );
  measure();
  gsap.set(
    schools.flatMap((school) =>
      [...school.children].filter((child) => !child.matches('.school-node')),
    ),
    { autoAlpha: 0 },
  );
  const travel = gsap.fromTo(
    fill,
    { [desktop ? 'scaleX' : 'scaleY']: 0 },
    {
      [desktop ? 'scaleX' : 'scaleY']: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: block,
        start: desktop ? 'top 80%' : 'top 75%',
        end: desktop ? 'bottom 55%' : 'bottom 60%',
        scrub: 0.6,
        onRefresh: (self) => {
          measure();
          render(self.progress);
        },
        onUpdate: (self) => render(self.progress),
      },
    },
  );
  render(0);

  return () => {
    travel.scrollTrigger?.kill();
    openings.forEach((timeline) => timeline.kill());
    reached = schools.map(() => false);
    schools.forEach((school) => school.classList.remove('is-reached'));
    counts.forEach(([element, text]) => (element.textContent = text));
    if (label) label.textContent = '';
  };
}

/**
 * Toolkit: icons gather from scattered positions into the grid (desktop) or
 * pop in from the centre (mobile). Once assembled, a backlight sweeps across
 * the keys diagonally, and on fine pointers each key tilts toward the cursor.
 */
function mountToolkit(desktop: boolean): Cleanup {
  const toolkit = document.querySelector<HTMLElement>('.about-toolkit');
  if (!toolkit) return () => {};
  const q = gsap.utils.selector(toolkit);
  const items = q('.toolkit-item') as HTMLElement[];
  const title = q('.toolkit-title > *');
  const cleanups: Cleanup[] = [];

  // Built per run as one timeline, so cleanup can stop a sweep mid-flight
  // (callbacks run outside the matchMedia context that reverts the rest).
  let sweeping: gsap.core.Timeline | undefined;
  const sweep = () => {
    sweeping?.progress(1).kill();
    const columns = Math.max(
      1,
      getComputedStyle(q('.toolkit-grid')[0]).gridTemplateColumns.split(' ')
        .length,
    );
    const timeline = gsap.timeline();
    items.forEach((item, i) => {
      const at = ((i % columns) + Math.floor(i / columns)) * 0.09;
      timeline
        .call(() => item.classList.add('is-lit'), undefined, at)
        .call(() => item.classList.remove('is-lit'), undefined, at + 0.55)
        .fromTo(
          item.querySelector('.toolkit-icon'),
          { y: 0 },
          { y: -8, duration: 0.32, ease: 'power2.out', yoyo: true, repeat: 1 },
          at,
        );
    });
    sweeping = timeline;
  };

  if (desktop) {
    const assemble = gsap.timeline({
      scrollTrigger: {
        trigger: toolkit,
        start: 'top 95%',
        end: 'center 60%',
        scrub: true,
      },
    });
    items.forEach((item, i) => {
      const from = scatter(i);
      assemble.from(
        item,
        {
          x: () => from.x * window.innerWidth * 0.38,
          y: () => from.y * window.innerHeight * 0.42,
          rotate: from.rotate,
          scale: 0.35,
          autoAlpha: 0,
          duration: 1,
          ease: ease.soft,
        },
        i * 0.045,
      );
    });
    assemble.from(
      title,
      {
        y: 36,
        autoAlpha: 0,
        duration: 0.5,
        stagger: stagger.wide,
        ease: 'power2.out',
      },
      '>-0.45',
    );
  } else {
    gsap.from(items, {
      scale: 0.4,
      autoAlpha: 0,
      duration: 0.9,
      ease: ease.pop,
      stagger: { each: 0.05, from: 'center' },
      scrollTrigger: { trigger: toolkit, start: 'top 80%', once: true },
    });
    gsap.from(title, {
      y: 30,
      autoAlpha: 0,
      duration: duration.entrance,
      ease: ease.enter,
      stagger: 0.1,
      scrollTrigger: { trigger: toolkit, start: 'top 85%', once: true },
    });
  }

  // The sweep plays each time the grid settles into view.
  ScrollTrigger.create({
    trigger: q('.toolkit-grid')[0],
    start: desktop ? 'center 55%' : 'top 60%',
    onEnter: sweep,
    onEnterBack: sweep,
  });

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches)
    items.forEach((item) => {
      const tiltX = gsap.quickTo(item, 'rotationX', {
        duration: duration.medium,
        ease: ease.soft,
      });
      const tiltY = gsap.quickTo(item, 'rotationY', {
        duration: duration.medium,
        ease: ease.soft,
      });
      gsap.set(item, { transformPerspective: 500 });
      const move = (event: PointerEvent) => {
        const box = item.getBoundingClientRect();
        const dx = (event.clientX - box.left) / box.width - 0.5;
        const dy = (event.clientY - box.top) / box.height - 0.5;
        tiltY(dx * 22);
        tiltX(-dy * 22);
      };
      const leave = () => {
        tiltX(0);
        tiltY(0);
      };
      item.addEventListener('pointermove', move);
      item.addEventListener('pointerleave', leave);
      cleanups.push(() => {
        item.removeEventListener('pointermove', move);
        item.removeEventListener('pointerleave', leave);
      });
    });

  return () => {
    sweeping?.kill();
    cleanups.forEach((cleanup) => cleanup());
    items.forEach((item) => item.classList.remove('is-lit'));
  };
}

export function mountAbout(desktop: boolean): Cleanup {
  const education = mountEducation(desktop);
  const toolkit = mountToolkit(desktop);
  return () => {
    toolkit();
    education();
  };
}
