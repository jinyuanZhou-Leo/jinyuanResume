import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ease } from './tokens';
import type { Cleanup } from './types';

/**
 * Desktop chapter transitions. The résumé behaves like a stack of pages:
 * each chapter holds still once its last line reaches the bottom of the
 * screen, the next chapter slides over it with a rounded top edge that
 * flattens as it lands, and the page underneath settles back and darkens.
 * The footer closes the stack the same way, so every boundary on the page
 * follows one rule. The hero curtain (hero.ts) is the first instance.
 */
export function mountStack(): Cleanup {
  const root = document.documentElement;
  const main = document.querySelector<HTMLElement>('main');
  const pages = [
    ...document.querySelectorAll<HTMLElement>('.sheet > .chapter'),
  ];
  const contact = document.querySelector<HTMLElement>('.chapter-contact');
  if (!main || pages.length < 2) return () => {};

  // A page sticks when its bottom meets the viewport's bottom.
  const sticky = [...pages, main];
  const measure = () => {
    const viewport = window.innerHeight;
    sticky.forEach((page) =>
      page.style.setProperty(
        '--stick',
        `${Math.min(0, viewport - page.offsetHeight)}px`,
      ),
    );
  };
  // ScrollTrigger must read every position from normal flow, never from a
  // page that happens to be stuck at the moment of measuring.
  const onRefreshInit = () => {
    root.classList.add('motion-measuring');
    measure();
  };
  const onRefresh = () => root.classList.remove('motion-measuring');
  ScrollTrigger.addEventListener('refreshInit', onRefreshInit);
  ScrollTrigger.addEventListener('refresh', onRefresh);
  measure();

  const pairs: [under: HTMLElement, over: HTMLElement][] = pages
    .slice(1)
    .map((over, index) => [pages[index], over]);
  if (contact) pairs.push([pages[pages.length - 1], contact]);

  pairs.forEach(([under, over]) => {
    const landing = { trigger: over, start: 'top bottom', end: 'top top' };
    gsap.fromTo(
      over,
      { '--enter': 0 },
      {
        '--enter': 1,
        ease: ease.land,
        scrollTrigger: { ...landing, scrub: true },
      },
    );
    gsap.fromTo(
      under,
      { '--recede': 0 },
      {
        '--recede': 1,
        ease: ease.settle,
        scrollTrigger: {
          ...landing,
          scrub: true,
          toggleClass: { targets: under, className: 'is-receding' },
        },
      },
    );
    // Fully covered pages stop painting. One-sided callbacks, because a
    // trigger ending at 'max' would deactivate at the very bottom of the page.
    ScrollTrigger.create({
      trigger: over,
      start: 'top top',
      onEnter: () => under.classList.add('is-covered'),
      onLeaveBack: () => under.classList.remove('is-covered'),
    });
  });

  return () => {
    ScrollTrigger.removeEventListener('refreshInit', onRefreshInit);
    ScrollTrigger.removeEventListener('refresh', onRefresh);
    root.classList.remove('motion-measuring');
    [...sticky, ...pages, ...(contact ? [contact] : [])].forEach((page) => {
      page.style.removeProperty('--stick');
      page.style.removeProperty('--enter');
      page.style.removeProperty('--recede');
      page.classList.remove('is-receding', 'is-covered');
    });
  };
}
