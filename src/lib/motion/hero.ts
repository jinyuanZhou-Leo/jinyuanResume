import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Cleanup } from './types';
import { ease, stagger } from './tokens';

/** The opening: photographs unfold tile by tile while the name rises letter by letter. */
export function playHeroIntro(): Cleanup {
  const root = document.documentElement;
  const hero = document.querySelector<HTMLElement>('.hero');
  if (!hero) {
    root.classList.remove('motion-pending');
    return () => {};
  }
  const q = gsap.utils.selector(hero);
  const tiles = q('.hero-gallery-tile');
  const intro = gsap.timeline({ defaults: { ease: ease.enter } });
  intro
    .from(
      tiles,
      {
        clipPath: 'inset(100% 0% 0% 0%)',
        duration: 1.6,
        stagger: { each: 0.09, from: 'end' },
      },
      0,
    )
    .from(
      tiles,
      {
        '--reveal-scale': 1.4,
        duration: 2.2,
        stagger: { each: 0.09, from: 'end' },
      },
      0,
    )
    .from(
      '.site-header',
      { yPercent: -100, duration: 1.2, clearProps: 'transform' },
      0.25,
    )
    .from(q('.hero-intro'), { y: 24, autoAlpha: 0, duration: 1 }, 0.35)
    .from(
      q('.split-char'),
      { yPercent: 118, rotate: 7, duration: 1.3, stagger: stagger.tight },
      0.4,
    )
    .from(
      q('.name-period'),
      { scale: 0, duration: 0.9, ease: 'back.out(3)' },
      1.05,
    )
    .from(
      q('h2 .split-line-inner'),
      { yPercent: 118, duration: 1.2, stagger: 0.1 },
      0.7,
    )
    .from(
      q('.hero-description, .hero-content .button'),
      { y: 26, autoAlpha: 0, duration: 1.1, stagger: stagger.loose },
      0.95,
    )
    .from(
      q('.hero-bottom > *'),
      { y: 16, autoAlpha: 0, duration: 1, stagger: stagger.base },
      1.15,
    );
  // Every from-state is now applied, so the composition can be shown.
  root.classList.remove('motion-pending');
  return () => intro.progress(1).kill();
}

/**
 * Desktop: the hero holds still while the résumé sheet slides over it.
 * The photographs recede, darken and round off like a card being set down.
 * Narrow screens keep native flow with a light parallax.
 */
export function mountHeroScroll(desktop: boolean): Cleanup {
  const chapter = document.querySelector<HTMLElement>('#top');
  const hero = chapter?.querySelector<HTMLElement>('.hero');
  const sheet = document.querySelector<HTMLElement>('.sheet');
  if (!chapter || !hero || !sheet) return () => {};
  const q = gsap.utils.selector(hero);
  if (!desktop) {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
      .to(q('.hero-gallery'), { yPercent: 12, ease: 'none' }, 0)
      .to(
        q('.hero-content'),
        { yPercent: -10, autoAlpha: 0.2, ease: 'none' },
        0,
      );
    return () => {};
  }
  gsap
    .timeline({
      scrollTrigger: {
        trigger: sheet,
        start: 'top bottom',
        end: 'top top',
        scrub: true,
      },
    })
    .to(hero, { scale: 0.9, borderRadius: 28, ease: 'power1.in' }, 0)
    .to(q('.hero-gallery'), { yPercent: 5, scale: 1.16, ease: 'none' }, 0)
    .to(
      q('.hero-content'),
      { yPercent: -22, autoAlpha: 0, ease: 'power1.in' },
      0,
    )
    .to(q('.hero-bottom'), { autoAlpha: 0, duration: 0.4, ease: 'none' }, 0)
    .to(q('.hero-shade'), { opacity: 0.6, ease: 'none' }, 0)
    .fromTo(
      sheet,
      { '--sheet-radius': '40px' },
      { '--sheet-radius': '0px', ease: 'power2.in' },
      0,
    );
  // Once covered, the photographs stop animating and painting.
  const cover = ScrollTrigger.create({
    trigger: sheet,
    start: 'top top',
    end: 'max',
    toggleClass: { targets: chapter, className: 'is-covered' },
  });
  return () => {
    cover.kill();
    chapter.classList.remove('is-covered');
  };
}
