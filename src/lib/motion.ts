import { animate, scroll, stagger } from 'motion';

// Animate reading groups, not nested children: no compounded opacity or transforms.
const revealGroups = [
  '.section-heading',
  '.featured-project',
  '.project-row',
  '.experience-layout > div:first-child',
  '.experience-detail',
  '.about-intro > div',
  '.about-intro > p',
  '.education',
  '.skills',
  '.github-reveal',
  '.contact-top > div',
  '.contact-art',
  '.contact-bottom',
  '.footer-line',
].join(',');

export function mountMotion() {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const disposers: (() => void)[] = [];
  const stop = () => disposers.splice(0).forEach((dispose) => dispose());
  const start = () => {
    stop();
    if (preference.matches) return;
    const intro = animate(
      '.hero-content > *',
      { opacity: [0.2, 1], y: [30, 0] },
      {
        duration: 1.05,
        delay: stagger(0.1),
        ease: [0.22, 1, 0.36, 1],
      },
    );
    disposers.push(() => intro.complete());

    // Motion's scroll timelines reveal each group as it enters, and reverse on scrolling back.
    // Without JavaScript (or with reduced motion), the CSS default remains fully visible.
    document.querySelectorAll<HTMLElement>(revealGroups).forEach((element) => {
      const visual = element.matches('.featured-project, .contact-art');
      const reveal = animate(
        element,
        {
          opacity: [0.12, 1],
          y: [visual ? 64 : 40, 0],
          scale: [visual ? 0.96 : 1, 1],
        },
        { ease: [0.16, 1, 0.3, 1] },
      );
      disposers.push(
        scroll(reveal, {
          target: element,
          // Complete bottom content before the document reaches its scroll limit.
          offset: element.matches('.contact-bottom, .footer-line')
            ? ['start 100%', 'end 100%']
            : ['start 98%', 'start 62%'],
        }),
      );
      disposers.push(() => {
        reveal.complete();
        element.style.removeProperty('transform');
        element.style.removeProperty('opacity');
      });
    });

    const hero = document.querySelector<HTMLElement>('.hero');
    if (hero && window.matchMedia('(min-width: 761px)').matches) {
      const depth = animate(
        '.hero-image',
        { scale: [1, 1.055] },
        { ease: 'linear' },
      );
      disposers.push(
        scroll(depth, { target: hero, offset: ['start start', 'end start'] }),
      );
      disposers.push(() => {
        depth.cancel();
        document
          .querySelector<HTMLElement>('.hero-image')
          ?.style.removeProperty('transform');
      });
    }
  };
  start();
  preference.addEventListener('change', start);
  return () => {
    stop();
    preference.removeEventListener('change', start);
  };
}
