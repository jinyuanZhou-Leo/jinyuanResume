import Lenis from 'lenis';

import {
  getElementTop,
  getChapterStops,
  SCROLL_STOPS_CHANGED,
} from './scroll-stops';

function calculateKeyframes(): { workThreshold: number; keyframes: number[] } {
  const nav =
    document.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 0;
  const work = document.querySelector<HTMLElement>('#work');
  if (!work) return { workThreshold: Infinity, keyframes: [] };
  const heading = work.querySelector<HTMLElement>('.section-heading') ?? work;
  const workThreshold = Math.max(0, getElementTop(heading) - nav - 40);
  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  const stops = [
    ...document.querySelectorAll<HTMLElement>(
      '.scroll-scene:not([data-scene-first])',
    ),
  ].flatMap((scene) => [...getChapterStops(scene, nav)]);
  const keyframes = [
    ...new Set(
      stops
        .filter(Number.isFinite)
        .map(Math.round)
        .filter((p) => p >= workThreshold - 10 && p <= maxScroll),
    ),
  ].sort((a, b) => a - b);
  return { workThreshold, keyframes };
}

/**
 * Direction-Aware Keyframe Snapping:
 * Strictly adheres to the user's scroll momentum and direction.
 * When scrolling downwards, it NEVER snaps backwards; it advances cleanly to the next keyframe.
 * When scrolling upwards, it gracefully docks to the previous keyframe.
 * The hero section remains completely unrestricted.
 */
export function mountSnapTimeline(smoothScroll: Lenis): () => void {
  let currentKeyframes: number[] = [];
  let workThreshold = 0;
  let lastDirection = 1; // 1 = down, -1 = up
  let isProgrammaticSnap = false;
  let debounceTimer: number | null = null;

  const refreshKeyframes = () => {
    const data = calculateKeyframes();
    workThreshold = data.workThreshold;
    currentKeyframes = data.keyframes;
  };

  refreshKeyframes();

  const cancelDebounce = () => {
    if (debounceTimer !== null) {
      window.clearTimeout(debounceTimer);
      debounceTimer = null;
    }
  };

  const performDirectionalSnap = () => {
    if (isProgrammaticSnap) return;
    const currentScroll = Math.round(smoothScroll.scroll);

    // If the user is still browsing within the hero section, do not enforce snapping.
    if (currentScroll < workThreshold - 24) return;

    if (currentKeyframes.length === 0) return;

    // Find bounding keyframes around the current position
    const prevIndex = currentKeyframes.findLastIndex(
      (k) => k <= currentScroll + 3,
    );
    const nextIndex = currentKeyframes.findIndex((k) => k >= currentScroll - 3);

    let target: number | null = null;

    if (lastDirection >= 0) {
      // SCROLLING DOWNWARDS:
      // STRICT RULE: NEVER snap backwards!
      // Always snap forward to the upcoming keyframe, unless already locked exactly on it.
      if (nextIndex !== -1) {
        const nextTarget = currentKeyframes[nextIndex];
        if (nextTarget > currentScroll + 5) {
          target = nextTarget;
        }
      }
    } else {
      // SCROLLING UPWARDS:
      // Snap backwards towards the previous keyframe to honor back-navigation.
      if (prevIndex !== -1) {
        const prevTarget = currentKeyframes[prevIndex];
        if (prevTarget < currentScroll - 5) {
          target = prevTarget;
        }
      }
    }

    if (target !== null && Math.abs(target - currentScroll) > 4) {
      isProgrammaticSnap = true;
      smoothScroll.scrollTo(target, {
        duration: 1.05,
        // Ease in and out so the snap does not lurch into its target.
        easing: (t: number) => t * t * (3 - 2 * t),
        userData: { initiator: 'directional-snap' },
        onComplete: () => {
          isProgrammaticSnap = false;
        },
      });
    }
  };

  // Immediate interrupt if the user physically initiates another scroll
  const onUserPhysicalInteraction = () => {
    if (isProgrammaticSnap) {
      isProgrammaticSnap = false;
    }
  };

  window.addEventListener('wheel', onUserPhysicalInteraction, {
    passive: true,
  });
  window.addEventListener('touchmove', onUserPhysicalInteraction, {
    passive: true,
  });

  const handleScroll = (e: {
    scroll: number;
    velocity: number;
    userData?: Record<string, unknown>;
  }) => {
    // If the scroll was triggered by our own snapping animation, don't re-trigger
    if (e.userData?.initiator === 'directional-snap') {
      return;
    }

    // Capture user scroll direction accurately
    if (Math.abs(e.velocity) > 0.03) {
      lastDirection = e.velocity > 0 ? 1 : -1;
    }

    cancelDebounce();
    // Let physical input settle before advancing to the next reading stop.
    debounceTimer = window.setTimeout(performDirectionalSnap, 75);
  };

  smoothScroll.on('scroll', handleScroll);

  let resizeTimer: number | null = null;
  const debouncedRefresh = () => {
    if (resizeTimer !== null) {
      window.clearTimeout(resizeTimer);
    }
    resizeTimer = window.setTimeout(refreshKeyframes, 200);
  };

  window.addEventListener('resize', debouncedRefresh);
  window.addEventListener(SCROLL_STOPS_CHANGED, debouncedRefresh);

  const observer = new ResizeObserver(debouncedRefresh);
  const main = document.querySelector('main');
  if (main) observer.observe(main);

  return () => {
    cancelDebounce();
    if (resizeTimer !== null) window.clearTimeout(resizeTimer);
    window.removeEventListener('wheel', onUserPhysicalInteraction);
    window.removeEventListener('touchmove', onUserPhysicalInteraction);
    smoothScroll.off('scroll', handleScroll);
    window.removeEventListener('resize', debouncedRefresh);
    window.removeEventListener(SCROLL_STOPS_CHANGED, debouncedRefresh);
    observer.disconnect();
  };
}
