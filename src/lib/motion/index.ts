import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { mountAbout } from './about';
import { mountChrome } from './chrome';
import { mountClosing } from './closing';
import { mountExperience } from './experience';
import { mountHeroScroll, playHeroIntro } from './hero';
import { easeInOutExpo, travelDuration } from './math';
import { mountPointer } from './pointer';
import { mountReveals } from './reveal';
import { mountStack } from './stack';
import type { Cleanup, MotionScope } from './types';
import { mountWork } from './work';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export interface MotionController {
  navigate(target: HTMLElement | number, immediate?: boolean): void;
  dispose(): void;
}

/**
 * Page-level motion lifecycle. Everything is built inside a GSAP matchMedia
 * context, so crossing the 761px breakpoint, toggling reduced motion or
 * printing reverts every inline style and pin before the next layout applies.
 * Without motion the page is an ordinary, fully readable document.
 */
export function mountMotion(): MotionController {
  const root = document.documentElement;
  const header = document.querySelector<HTMLElement>('.site-header');
  const controller = new AbortController();
  const { signal } = controller;
  let lenis: Lenis | undefined;
  let anchors: ((element: HTMLElement) => number | undefined)[] = [];

  const measureHeader = () =>
    root.style.setProperty('--nav-height', `${header?.offsetHeight ?? 0}px`);
  measureHeader();
  const headerResize = new ResizeObserver(measureHeader);
  if (header) headerResize.observe(header);

  const resolveTop = (target: HTMLElement) => {
    if (target.id === 'top') return 0;
    for (const resolve of anchors) {
      const top = resolve(target);
      if (top !== undefined) return top;
    }
    // Read the target's place in normal flow, not where a stuck page holds it.
    root.classList.add('motion-measuring');
    const top = target.getBoundingClientRect().top + window.scrollY;
    root.classList.remove('motion-measuring');
    return Math.max(0, top - (header?.offsetHeight ?? 0));
  };

  const navigate = (target: HTMLElement | number, immediate = false) => {
    const top = typeof target === 'number' ? target : resolveTop(target);
    if (lenis) {
      lenis.scrollTo(top, {
        immediate,
        force: true,
        duration: travelDuration(top - window.scrollY),
        easing: easeInOutExpo,
      });
    } else window.scrollTo({ top, behavior: immediate ? 'instant' : 'smooth' });
  };

  // Same-page anchors travel through the active scroll controller so pinned
  // chapters resolve their own targets instead of relying on layout offsets.
  document.addEventListener(
    'click',
    (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>('a[href]')
          : null;
      if (
        !link ||
        link.classList.contains('skip-link') ||
        link.hasAttribute('download') ||
        (link.target && link.target !== '_self')
      )
        return;
      const url = new URL(link.href);
      if (
        url.origin !== location.origin ||
        url.pathname !== location.pathname ||
        url.search !== location.search ||
        !url.hash
      )
        return;
      const element = document.getElementById(
        decodeURIComponent(url.hash.slice(1)),
      );
      if (!element) return;
      event.preventDefault();
      if (url.hash !== location.hash)
        history.pushState(history.state, '', url.hash);
      navigate(element);
    },
    { signal, capture: true },
  );
  const restoreHash = () => {
    const element = location.hash
      ? document.getElementById(decodeURIComponent(location.hash.slice(1)))
      : null;
    if (element) navigate(element, true);
  };
  window.addEventListener('popstate', restoreHash, { signal });

  const media = gsap.matchMedia();
  media.add(
    {
      desktop: '(min-width: 761px)',
      // matchMedia only runs when at least one condition matches.
      mobile: '(max-width: 760px)',
      reduce: '(prefers-reduced-motion: reduce)',
      print: 'print',
    },
    (context) => {
      const { desktop, reduce, print } = context.conditions as Record<
        string,
        boolean
      >;
      if (reduce || print) {
        root.classList.remove('motion-pending');
        return;
      }
      root.classList.add('motion');
      const smooth = new Lenis({
        lerp: 0.085,
        smoothWheel: true,
        syncTouch: false,
        anchors: false,
        autoRaf: false,
      });
      lenis = smooth;
      const unsubscribe = smooth.on('scroll', ScrollTrigger.update);
      const raf = (time: number) => smooth.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      const scope: MotionScope = {
        desktop: !!desktop,
        lenis: smooth,
        registerAnchor: (resolve) => anchors.push(resolve),
        navigate,
      };
      // The pinned reel is created first: triggers made after a pin include
      // its spacing, so every later chapter measures from the real layout.
      const cleanups: Cleanup[] = [mountWork(scope), playHeroIntro()];
      if (scope.desktop) cleanups.push(mountStack());
      mountReveals();
      cleanups.push(
        mountHeroScroll(scope.desktop),
        mountChrome(),
        mountExperience(),
        mountAbout(scope.desktop),
        mountClosing(smooth),
        mountPointer(),
      );
      // Refresh in document order regardless of creation order.
      ScrollTrigger.sort();
      ScrollTrigger.refresh();

      // Late content (fonts, the GitHub island, images) changes chapter heights.
      let pending = 0;
      const refresh = () => {
        cancelAnimationFrame(pending);
        // Lenis tracks its own size (autoResize); triggers need a refresh.
        pending = requestAnimationFrame(() => ScrollTrigger.refresh());
      };
      const layout = new ResizeObserver(refresh);
      document
        .querySelectorAll<HTMLElement>('.chapter:not(#top) > *')
        .forEach((element) => layout.observe(element));
      void document.fonts.ready.then(refresh);

      return () => {
        layout.disconnect();
        cancelAnimationFrame(pending);
        cleanups.reverse().forEach((cleanup) => cleanup());
        anchors = [];
        unsubscribe();
        gsap.ticker.remove(raf);
        gsap.ticker.lagSmoothing(500, 33);
        smooth.destroy();
        lenis = undefined;
        root.classList.remove('motion', 'motion-pending');
      };
    },
  );

  return {
    navigate,
    dispose: () => {
      controller.abort();
      media.revert();
      headerResize.disconnect();
      root.classList.remove('motion-pending');
    },
  };
}
