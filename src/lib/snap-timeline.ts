import Lenis from 'lenis';

function getElementTop(element: HTMLElement | null): number {
  let top = 0;
  let current: HTMLElement | null = element;
  while (current) {
    top += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }
  return top;
}

/**
 * Collect fine-grained animation keyframes strictly starting from #work downwards.
 * Each section is decomposed into its distinct animation choreographies.
 */
function calculateKeyframes(): { workThreshold: number; keyframes: number[] } {
  const containerHeight = window.innerHeight;
  const header = document.querySelector<HTMLElement>('.site-header');
  const navHeight = header?.offsetHeight ?? 88;
  const isDesktop = window.innerWidth >= 761;
  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - containerHeight,
  );

  const keyframes: number[] = [];

  // --- SECTION 1: #work (从“想法，正在运行。”标题与卡片堆叠开始，排除上方 5 个卡片横向平移的 project-overview) ---
  const work = document.querySelector<HTMLElement>('#work');
  if (!work) return { workThreshold: 0, keyframes: [] };

  const heading = work.querySelector<HTMLElement>('.section-heading');
  const stack = work.querySelector<HTMLElement>('.selected-work-stack');
  const headingTop = heading
    ? getElementTop(heading)
    : stack
      ? getElementTop(stack)
      : getElementTop(work);

  // 严格在 5 个卡片横向移动之后、到达“想法，正在运行。”标题时才启动吸附
  const workThreshold = Math.max(0, headingTop - containerHeight * 0.35);

  // 1.1 标题“想法，正在运行。”居中定格
  keyframes.push(Math.round(headingTop - navHeight));

  // 1.2 SelectedWorkStack cards - each card pinning state is its own keyframe
  const cards = [...work.querySelectorAll<HTMLElement>('.scroll-stack-card')];
  if (cards.length > 0) {
    const cardHeight = cards[0]?.offsetHeight ?? 0;
    const requestedStackPositionPx = 0.2 * containerHeight;
    const stackPositionPx = Math.min(
      requestedStackPositionPx,
      Math.max(0, containerHeight - cardHeight - 24),
    );
    const itemStackDistance = 26;

    cards.forEach((card, index) => {
      const cardTop = getElementTop(card);
      // The exact scroll position where this card reaches its resting stacked spot
      const pinTrigger = cardTop - stackPositionPx - itemStackDistance * index;
      if (pinTrigger > headingTop - navHeight) {
        keyframes.push(Math.round(pinTrigger));
      }
    });

    const stackEnd = work.querySelector<HTMLElement>('.scroll-stack-end');
    if (stackEnd) {
      const endTop = getElementTop(stackEnd);
      const stackFinish = endTop - containerHeight / 2;
      if (stackFinish > 0) {
        keyframes.push(Math.round(stackFinish));
      }
    }
  }

  // --- SECTION 2: #experience (实习中的学习与实践) ---
  const exp = document.querySelector<HTMLElement>('#experience');
  if (exp) {
    const expTop = getElementTop(exp);
    if (isDesktop) {
      // On desktop, reading-sequence.css pins #experience stage across 180svh.
      // chapters.ts coordinates heading (0.18), summary (0.25), points (0.38, 0.52, 0.66), tags (0.80).
      const expScrollable = Math.max(0, exp.offsetHeight - containerHeight);
      const phases = [
        0.24, // Phase 1: Headline & company role locked in
        0.42, // Phase 2: Point 1 (Unitree SDK & Motion control) revealed
        0.56, // Phase 3: Point 2 (React 19 + FastAPI + RAG) revealed
        0.7, // Phase 4: Point 3 (ROS 2 & Embodied AI) revealed
        0.84, // Phase 5: Complete layout with tags fully resolved
      ];
      phases.forEach((p) => {
        keyframes.push(Math.round(expTop + expScrollable * p));
      });
    } else {
      keyframes.push(Math.round(expTop - navHeight));
    }
  }

  // --- SECTION 3: #about (逻辑之外，生活之内) ---
  const about = document.querySelector<HTMLElement>('#about');
  if (about) {
    const aboutTop = getElementTop(about);
    if (isDesktop) {
      // On desktop, about-journey.ts coordinates multiple scenes over 260svh:
      // 0.08: Heading & Bio statement fully crisp
      // 0.22: High school (NFSL) in focal view
      // 0.36: University of Toronto in focal view
      // 0.60: Interactive Toolkit & orbiting icons fully deployed
      // 0.74: Soft skills item 1 in sharp focus
      // 0.84: Soft skills item 2 in sharp focus
      // 0.94: Soft skills item 3 in sharp focus
      const aboutScrollable = Math.max(0, about.offsetHeight - containerHeight);
      const phases = [0.08, 0.22, 0.36, 0.6, 0.74, 0.84, 0.94];
      phases.forEach((p) => {
        keyframes.push(Math.round(aboutTop + aboutScrollable * p));
      });
    } else {
      keyframes.push(Math.round(aboutTop - navHeight));
    }
  }

  // --- SECTION 4: #github (代码留在世界上的痕迹) ---
  const github = document.querySelector<HTMLElement>('#github');
  if (github) {
    const githubTop = getElementTop(github);
    if (isDesktop) {
      // reading-sequence.css pins #github over 460svh:
      // ~0.26: Heading revealed
      // ~0.52: Complete grid & live contribution heat state fully open
      // ~0.76: Fully legible before transition towards contact
      const githubScrollable = Math.max(
        0,
        github.offsetHeight - containerHeight,
      );
      const phases = [0.26, 0.52, 0.76];
      phases.forEach((p) => {
        keyframes.push(Math.round(githubTop + githubScrollable * p));
      });
    } else {
      keyframes.push(Math.round(githubTop - navHeight));
    }
  }

  // --- SECTION 5: #contact (下一个好想法，从一句你好开始) ---
  const contact = document.querySelector<HTMLElement>('#contact');
  if (contact) {
    const contactTop = getElementTop(contact);
    keyframes.push(Math.round(contactTop - navHeight));
  }

  // Deduplicate and filter keyframes (strictly >= headingTop - navHeight)
  const sorted = keyframes
    .filter((pos) => pos >= headingTop - navHeight - 10 && pos <= maxScroll)
    .sort((a, b) => a - b);

  const cleanKeyframes: number[] = [];
  for (const pos of sorted) {
    if (
      cleanKeyframes.length === 0 ||
      pos - cleanKeyframes[cleanKeyframes.length - 1] > 40
    ) {
      cleanKeyframes.push(pos);
    }
  }

  return {
    workThreshold,
    keyframes: cleanKeyframes,
  };
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
        duration: 0.65,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
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
    // Schedule snap after user input halts (220ms debounce)
    debounceTimer = window.setTimeout(performDirectionalSnap, 220);
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
    observer.disconnect();
  };
}
