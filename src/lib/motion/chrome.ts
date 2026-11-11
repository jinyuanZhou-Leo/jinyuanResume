import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Cleanup } from './types';

/**
 * Page chrome: the header steps aside while reading downward and returns on
 * the way back, a hairline tracks overall progress, the current chapter is
 * marked in the navigation. Chapter tones are plain CSS (tokens.css).
 */
export function mountChrome(): Cleanup {
  const header = document.querySelector<HTMLElement>('.site-header');
  const cleanups: Cleanup[] = [];

  if (header) {
    let hidden = false;
    const show = (visible: boolean) => {
      if (hidden === !visible) return;
      hidden = !visible;
      gsap.to(header, {
        yPercent: visible ? 0 : -100,
        duration: visible ? 0.7 : 0.55,
        ease: visible ? 'expo.out' : 'power3.in',
        overwrite: 'auto',
      });
    };
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (header.contains(document.activeElement)) return show(true);
        show(self.direction < 0 || self.scroll() < window.innerHeight * 0.5);
      },
    });
    const onFocus = () => show(true);
    header.addEventListener('focusin', onFocus);
    cleanups.push(() => {
      header.removeEventListener('focusin', onFocus);
      gsap.set(header, { clearProps: 'transform' });
    });

    const progress = header.querySelector<HTMLElement>('.scroll-progress');
    if (progress)
      gsap.fromTo(
        progress,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
        },
      );

    header.querySelectorAll<HTMLAnchorElement>('[data-nav]').forEach((link) => {
      const chapter = document.getElementById(link.dataset.nav!);
      if (!chapter) return;
      ScrollTrigger.create({
        trigger: chapter,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => link.classList.toggle('is-active', self.isActive),
      });
      cleanups.push(() => link.classList.remove('is-active'));
    });
  }

  return () => cleanups.reverse().forEach((cleanup) => cleanup());
}
