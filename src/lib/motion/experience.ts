import { gsap } from 'gsap';
import type { Cleanup } from './types';
import { ease, stagger } from './tokens';

/**
 * Each internship reads top to bottom: the role arrives line by line, every
 * point draws its own rule as it enters, and a rail fills with reading progress.
 */
export function mountExperience(): Cleanup {
  document
    .querySelectorAll<HTMLElement>('.experience-detail')
    .forEach((detail) => {
      const q = gsap.utils.selector(detail);
      gsap.fromTo(
        q('.experience-rail > span'),
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: detail,
            start: 'top 75%',
            end: 'bottom 55%',
            scrub: true,
          },
        },
      );
      gsap.from(q(':scope > p, :scope > h3'), {
        y: 34,
        autoAlpha: 0,
        duration: 1.1,
        ease: ease.enter,
        stagger: stagger.loose,
        scrollTrigger: { trigger: detail, start: 'top 82%', once: true },
      });
      q('.experience-points > li').forEach((point) => {
        gsap
          .timeline({
            scrollTrigger: { trigger: point, start: 'top 90%', once: true },
          })
          .fromTo(
            point,
            { '--rule': 0 },
            { '--rule': 1, duration: 1.2, ease: ease.travel },
            0,
          )
          .from(
            point.children,
            {
              y: 30,
              autoAlpha: 0,
              duration: 1,
              ease: ease.enter,
              stagger: stagger.loose,
            },
            0.2,
          );
      });
      gsap.from(q('.tags li'), {
        y: 14,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'back.out(2)',
        stagger: stagger.base,
        scrollTrigger: { trigger: q('.tags')[0], start: 'top 94%', once: true },
      });
    });
  return () => {};
}
