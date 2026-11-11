import { gsap } from 'gsap';
import type { Cleanup } from './types';
import { ease } from './tokens';

const interactive = 'a[href], button:not(:disabled), [data-cursor]';

/**
 * Fine pointers only: a soft ring trails the cursor and swells over anything
 * clickable, and marked controls lean magnetically toward the pointer.
 */
export function mountPointer(): Cleanup {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches)
    return () => {};
  const controller = new AbortController();
  const { signal } = controller;

  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  ring.setAttribute('aria-hidden', 'true');
  document.body.append(ring);
  gsap.set(ring, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
  const toX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: ease.soft });
  const toY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: ease.soft });
  let shown = false;
  window.addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType !== 'mouse') return;
      if (!shown) {
        shown = true;
        gsap.set(ring, { x: event.clientX, y: event.clientY });
        gsap.to(ring, { autoAlpha: 1, duration: 0.3 });
      }
      toX(event.clientX);
      toY(event.clientY);
    },
    { signal, passive: true },
  );
  document.addEventListener(
    'pointerover',
    (event) => {
      const target = event.target instanceof Element ? event.target : null;
      ring.classList.toggle('is-hover', !!target?.closest(interactive));
      ring.classList.toggle('is-dark', !!target?.closest('.contact-section'));
    },
    { signal, passive: true },
  );
  document.documentElement.addEventListener(
    'pointerleave',
    () => {
      shown = false;
      gsap.to(ring, { autoAlpha: 0, duration: 0.3 });
    },
    { signal },
  );
  window.addEventListener('pointerdown', () => ring.classList.add('is-down'), {
    signal,
    passive: true,
  });
  window.addEventListener('pointerup', () => ring.classList.remove('is-down'), {
    signal,
    passive: true,
  });

  const magnets = [
    ...document.querySelectorAll<HTMLElement>('[data-magnetic]'),
  ];
  magnets.forEach((magnet) => {
    const toMX = gsap.quickTo(magnet, 'x', {
      duration: 0.5,
      ease: ease.soft,
    });
    const toMY = gsap.quickTo(magnet, 'y', {
      duration: 0.5,
      ease: ease.soft,
    });
    magnet.addEventListener(
      'pointermove',
      (event) => {
        const box = magnet.getBoundingClientRect();
        toMX((event.clientX - (box.left + box.width / 2)) * 0.32);
        toMY((event.clientY - (box.top + box.height / 2)) * 0.4);
      },
      { signal, passive: true },
    );
    magnet.addEventListener(
      'pointerleave',
      () =>
        gsap.to(magnet, {
          x: 0,
          y: 0,
          duration: 1.1,
          ease: 'elastic.out(1, 0.35)',
          overwrite: true,
        }),
      { signal },
    );
  });

  return () => {
    controller.abort();
    ring.remove();
    gsap.set(magnets, { clearProps: 'transform' });
  };
}
