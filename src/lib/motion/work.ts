import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  clamp,
  focusDistance,
  reelIndex,
  reelScrollFor,
  reelTravel,
} from './math';
import type { Cleanup, MotionScope } from './types';
import { ease, pace, stagger } from './tokens';

/**
 * Two tilted rows of project tiles drift past each other with the scroll and
 * lean into fast scrolling. Copies that fill the rows are inert decoration.
 */
function mountDrift(desktop: boolean): Cleanup {
  const band = document.querySelector<HTMLElement>('.project-drift');
  const tilt = band?.querySelector<HTMLElement>('.drift-tilt');
  const original = band?.querySelector<HTMLElement>('[data-drift-row]');
  if (!band || !tilt || !original || !original.children.length) return () => {};
  const tiles = [...original.children] as HTMLElement[];
  if (!desktop) {
    gsap.from(tiles, {
      y: 60,
      autoAlpha: 0,
      rotate: 3,
      duration: 1.1,
      ease: ease.enter,
      stagger: stagger.loose,
      scrollTrigger: { trigger: band, start: 'top 85%', once: true },
    });
    return () => {};
  }
  const added: HTMLElement[] = [];
  const decorate = (tile: HTMLElement) => {
    const copy = tile.cloneNode(true) as HTMLElement;
    copy.setAttribute('aria-hidden', 'true');
    copy.tabIndex = -1;
    copy.inert = true;
    copy.removeAttribute('id');
    return copy;
  };
  const second = document.createElement('div');
  second.className = 'drift-row';
  second.setAttribute('aria-hidden', 'true');
  second.inert = true;
  tilt.append(second);
  added.push(second);
  const fill = (row: HTMLElement, order: HTMLElement[]) => {
    const target = window.innerWidth * 2.8;
    let guard = 0;
    while (row.scrollWidth < target && guard++ < 12)
      order.forEach((tile) => {
        const copy = decorate(tile);
        row.append(copy);
        if (row === original) added.push(copy);
      });
  };
  fill(original, tiles);
  fill(second, [...tiles].reverse());
  const rows = [original, second];
  const travel = () => original.scrollWidth * 0.32;
  gsap.fromTo(
    original,
    { x: () => -original.scrollWidth * 0.06 },
    {
      x: () => -original.scrollWidth * 0.06 - travel(),
      ease: 'none',
      scrollTrigger: {
        trigger: band,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    },
  );
  gsap.fromTo(
    second,
    { x: () => -second.scrollWidth * 0.06 - travel() },
    {
      x: () => -second.scrollWidth * 0.06,
      ease: 'none',
      scrollTrigger: {
        trigger: band,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    },
  );
  // Velocity lean: the rows shear slightly with fast scrolling, then settle.
  const lean = rows.map((row) =>
    gsap.quickTo(row, 'skewX', { duration: 0.6, ease: ease.soft }),
  );
  ScrollTrigger.create({
    trigger: band,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      const skew = clamp(self.getVelocity() / -320, -7, 7);
      lean.forEach((to) => to(skew));
    },
    onToggle: (self) => {
      if (!self.isActive) lean.forEach((to) => to(0));
    },
  });
  gsap.from(rows, {
    autoAlpha: 0,
    y: 80,
    duration: 1.4,
    ease: ease.enter,
    stagger: stagger.wide,
    scrollTrigger: { trigger: band, start: 'top 85%', once: true },
  });
  // Handoff to the reel: the loose, tilted overview straightens and steps
  // back while the ordered sequence rises to take its place.
  const reel = document.querySelector<HTMLElement>('.work-reel');
  if (reel)
    gsap
      .timeline({
        scrollTrigger: {
          trigger: reel,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
        },
      })
      .fromTo(tilt, { rotate: -7 }, { rotate: 0, scale: 0.86, ease: 'none' }, 0)
      .to(band, { autoAlpha: 0, ease: 'power2.in' }, 0);
  return () => added.forEach((element) => element.remove());
}

/**
 * Desktop: the project list becomes a pinned horizontal reel. The focused card
 * sits centred at full scale; its neighbours recede and their artwork slides
 * at a different rate. Resting positions snap to whole cards.
 */
function mountReel(scope: MotionScope): Cleanup {
  const reel = document.querySelector<HTMLElement>('.work-reel');
  const track = reel?.querySelector<HTMLElement>('.reel-track');
  if (!reel || !track) return () => {};
  const cards = [...track.querySelectorAll<HTMLElement>('.reel-card')];
  if (!cards.length) return () => {};
  const surfaces = cards.map(
    (card) => card.querySelector<HTMLElement>('.project-card') ?? card,
  );
  const artworks = cards.map((card) =>
    card.querySelector<HTMLElement>('.project-artwork'),
  );

  if (!scope.desktop) {
    cards.forEach((card, i) => {
      gsap.from(surfaces[i], {
        clipPath: 'inset(14% 8% 14% 8% round 18px)',
        y: 70,
        duration: 1.3,
        ease: ease.enter,
        scrollTrigger: { trigger: card, start: 'top 88%', once: true },
      });
      const art = artworks[i];
      if (art)
        gsap.fromTo(
          art,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
    });
    return () => {};
  }

  const digits = reel.querySelector<HTMLElement>('.reel-counter-digits');
  const bar = reel.querySelector<HTMLElement>('.reel-progress > span');
  const count = cards.length;
  let active = -1;
  let centers: number[] = [];
  const measure = () => {
    centers = cards.map((card) => card.offsetLeft + card.offsetWidth / 2);
  };
  const travel = () => {
    measure();
    return centers.length > 1 ? centers[count - 1] - centers[0] : 0;
  };
  // The pinned range is longer than the travel itself: each card gets more
  // scroll than its width, and the first and last cards rest before the reel
  // starts moving and before the page releases it.
  let distance = 0;
  let hold = 0;
  const length = () => {
    distance = travel();
    const rest = window.innerHeight * pace.reelHold;
    const total = distance * pace.reel + rest * 2;
    hold = total ? rest / total : 0;
    return total;
  };
  const setX = gsap.quickSetter(track, 'x', 'px');
  const setters = surfaces.map((surface) => ({
    scale: gsap.quickSetter(surface, 'scale'),
    opacity: gsap.quickSetter(surface, 'opacity'),
  }));
  const artSetters = artworks.map((art) =>
    art ? gsap.quickSetter(art, 'xPercent') : undefined,
  );
  const setActive = (index: number) => {
    if (index === active) return;
    active = index;
    cards.forEach((card, i) => card.classList.toggle('is-active', i === index));
    if (digits)
      gsap.to(digits, {
        yPercent: (-100 / count) * index,
        duration: 0.7,
        ease: ease.enter,
        overwrite: true,
      });
  };
  const render = (progress: number) => {
    const moved = reelTravel(progress, hold);
    const x = -distance * moved;
    setX(x);
    const viewport = window.innerWidth;
    centers.forEach((center, i) => {
      const d = focusDistance(center + x, viewport);
      const reach = Math.min(1, Math.abs(d) * 1.6);
      setters[i].scale(1 - reach * 0.14);
      setters[i].opacity(1 - reach * 0.55);
      artSetters[i]?.(d * -18);
    });
    if (bar) gsap.set(bar, { scaleX: moved });
    setActive(reelIndex(progress, count, hold));
  };
  const trigger = ScrollTrigger.create({
    trigger: reel,
    start: 'top top',
    end: () => `+=${length()}`,
    pin: true,
    anticipatePin: 1,
    onUpdate: (self) => render(self.progress),
    onRefresh: (self) => render(self.progress),
  });
  const stopFor = (index: number) =>
    reelScrollFor(index, count, trigger.start, trigger.end, hold);
  // Resting inside the reel always lands on a whole card.
  const settle = () => {
    if (!trigger.isActive) return;
    // The resting zones at either end are free; only travel snaps.
    const moved = reelTravel(trigger.progress, hold);
    if (moved <= 0 || moved >= 1) return;
    const y = stopFor(reelIndex(trigger.progress, count, hold));
    if (Math.abs(y - window.scrollY) > 2)
      scope.lenis.scrollTo(y, {
        duration: 0.8,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      });
  };
  ScrollTrigger.addEventListener('scrollEnd', settle);
  scope.registerAnchor((element) => {
    const index = cards.findIndex((card) => card.contains(element));
    if (index < 0) return undefined;
    return stopFor(index);
  });
  // Keyboard focus inside a neighbouring card brings that card to the centre.
  const onFocus = (event: FocusEvent) => {
    const index = cards.findIndex((card) =>
      card.contains(event.target as Node),
    );
    if (index >= 0 && index !== active) scope.navigate(stopFor(index));
  };
  track.addEventListener('focusin', onFocus);
  return () => {
    ScrollTrigger.removeEventListener('scrollEnd', settle);
    track.removeEventListener('focusin', onFocus);
    cards.forEach((card) => card.classList.remove('is-active'));
    gsap.set([track, ...surfaces, ...artworks.filter(Boolean)], {
      clearProps: 'all',
    });
    if (bar) gsap.set(bar, { clearProps: 'all' });
    if (digits) gsap.set(digits, { clearProps: 'all' });
  };
}

export function mountWork(scope: MotionScope): Cleanup {
  const drift = mountDrift(scope.desktop);
  const reel = mountReel(scope);
  return () => {
    reel();
    drift();
  };
}
