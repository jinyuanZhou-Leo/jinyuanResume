import { gsap } from 'gsap';
import { ease } from './tokens';

/**
 * Declarative entrances shared by every chapter:
 * - `lines`: masked lines rise into place, one after another
 * - `eyebrow`: the label tightens its tracking while fading in
 * - `fade`: a short lift for supporting copy and actions
 */
export function mountReveals(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
    gsap.from(el.querySelectorAll('.split-line-inner'), {
      yPercent: 118,
      rotate: 2.5,
      duration: 1.25,
      ease: ease.enter,
      stagger: 0.09,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
  root
    .querySelectorAll<HTMLElement>('[data-reveal="eyebrow"]')
    .forEach((el) => {
      gsap.from(el, {
        autoAlpha: 0,
        letterSpacing: '0.6em',
        x: -12,
        duration: 1.4,
        ease: ease.enter,
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      });
    });
  root.querySelectorAll<HTMLElement>('[data-reveal="fade"]').forEach((el) => {
    gsap.from(el, {
      autoAlpha: 0,
      y: 26,
      duration: 1.1,
      delay: 0.18,
      ease: ease.soft,
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    });
  });
}
