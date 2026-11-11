import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';
import { clamp, wrap } from './math';
import { githubProgress } from './signals';
import type { Cleanup } from './types';
import { ease, stagger } from './tokens';

/**
 * GitHub and the contact footer (the page-stack handoff lives in stack.ts). The GitHub module is a React island, so its
 * entrance is driven by a class on the Astro-owned wrapper and plain CSS;
 * hydration can replace its nodes without losing or stranding animation state.
 */
export function mountClosing(lenis: Lenis): Cleanup {
  const cleanups: Cleanup[] = [];
  const github = document.querySelector<HTMLElement>('#github');
  if (github) {
    ScrollTrigger.create({
      trigger: github,
      start: 'top 70%',
      once: true,
      onEnter: () => github.classList.add('is-inview'),
    });
    ScrollTrigger.create({
      trigger: github,
      start: 'top bottom',
      end: 'bottom top',
      // PixelBlast subscribes; it never measures scroll itself.
      onUpdate: (self) => githubProgress.set(Number(self.progress.toFixed(4))),
    });
    cleanups.push(() => {
      github.classList.remove('is-inview');
      githubProgress.set(0.5);
    });
  }

  const contact = document.querySelector<HTMLElement>('#contact');
  const body = contact?.querySelector<HTMLElement>(
    '.contact-section > .section',
  );
  if (contact && body) {
    const art = contact.querySelector<HTMLElement>('.contact-art');
    if (art)
      gsap.fromTo(
        art,
        { y: 120, rotate: -14, scale: 0.84 },
        {
          y: -30,
          rotate: 6,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: contact,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
          },
        },
      );

    const directory = contact.querySelector<HTMLElement>('.contact-bottom');
    if (directory)
      gsap
        .timeline({
          scrollTrigger: { trigger: directory, start: 'top 92%', once: true },
        })
        .fromTo(
          directory,
          { '--rule': 0 },
          { '--rule': 1, duration: 1.4, ease: ease.travel },
          0,
        )
        .from(
          directory.querySelectorAll('.eyebrow, .contact-item'),
          {
            y: 30,
            autoAlpha: 0,
            duration: 1,
            ease: ease.enter,
            stagger: stagger.base,
          },
          0.2,
        );

    // An endless motto that follows the scroll's direction and surges with its speed.
    const track = contact.querySelector<HTMLElement>('.marquee-track');
    if (track) {
      const setX = gsap.quickSetter(track, 'x', 'px');
      let x = 0;
      let direction = -1;
      let boost = 0;
      const tick = (_time: number, delta: number) => {
        const half = track.scrollWidth / 2;
        if (!half) return;
        boost += (0 - boost) * Math.min(1, delta / 400);
        x = wrap(x + direction * (0.045 + boost) * delta, -half, 0);
        setX(x);
      };
      const onScroll = ({ velocity }: { velocity: number }) => {
        if (Math.abs(velocity) > 0.1) direction = velocity > 0 ? -1 : 1;
        boost = Math.max(boost, clamp(Math.abs(velocity) * 0.02, 0, 0.6));
      };
      const visible = ScrollTrigger.create({
        trigger: track,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) =>
          self.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick),
      });
      const off = lenis.on('scroll', onScroll);
      cleanups.push(() => {
        visible.kill();
        gsap.ticker.remove(tick);
        off();
        gsap.set(track, { clearProps: 'transform' });
      });
    }
  }
  return () => cleanups.reverse().forEach((cleanup) => cleanup());
}
