import { animate, inView, scroll, stagger } from 'motion';

export function mountMotion() {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const disposers: (() => void)[] = [];
  const stop = () => {
    disposers.splice(0).forEach((dispose) => dispose());
  };
  const start = () => {
    stop();
    if (preference.matches) return;
    const intro = animate(
      '.hero-content > *',
      { opacity: [0.25, 1], y: [22, 0] },
      { duration: 0.85, delay: stagger(0.09), ease: [0.22, 1, 0.36, 1] },
    );
    disposers.push(() => intro.complete());
    disposers.push(
      inView(
        '[data-reveal]',
        (element) => {
          const reveal = animate(
            element,
            { opacity: [0.4, 1], y: [24, 0] },
            { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          );
          disposers.push(() => reveal.complete());
        },
        { amount: 0.25 },
      ),
    );
    // Each project reveals with scroll progress; static content stays readable without JS.
    document
      .querySelectorAll<HTMLElement>('[data-project-reveal]')
      .forEach((element) => {
        const reveal = animate(
          element,
          { opacity: [0.18, 1], y: [48, 0] },
          { ease: 'linear' },
        );
        disposers.push(
          scroll(reveal, {
            target: element,
            offset: ['start 96%', 'start 66%'],
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
