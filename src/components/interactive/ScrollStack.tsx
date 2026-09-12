import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import './ScrollStack.css';

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
  id?: string;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
  children,
  itemClassName = '',
  id,
}) => (
  <div
    id={id}
    className={`scroll-stack-card relative w-full h-80 my-8 p-12 rounded-[40px] shadow-[0_0_30px_rgba(0,0,0,0.1)] box-border origin-top will-change-transform ${itemClassName}`.trim()}
    style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
  >
    {children}
  </div>
);

interface ScrollStackProps {
  className?: string;
  children: ReactNode;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  rotationAmount?: number;
  blurAmount?: number;
  onStackComplete?: () => void;
  previousLabel?: string;
  nextLabel?: string;
}

interface TransformState {
  translateX: number;
  translateY: number;
  scale: number;
  rotation: number;
  blur: number;
}

/**
 * React Bits ScrollStack adapted to the site's existing window scroll lifecycle.
 * The page-level Lenis instance in lib/motion.ts remains the only scroll driver.
 */
const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  onStackComplete,
  previousLabel = 'Previous project',
  nextLabel = 'Next project',
}) => {
  const count = React.Children.count(children);
  const [activeIndex, setActiveIndex] = useState(count - 1);
  const [browsing, setBrowsing] = useState(false);
  const activeIndexRef = useRef(count - 1);
  const selectedRef = useRef(count - 1);
  const positionRef = useRef(count - 1);
  const frameTimeRef = useRef(0);
  const controlsRef = useRef<HTMLDivElement>(null);
  const browseRef = useRef(false);
  const selectCard = (direction: number) => {
    selectedRef.current = Math.max(
      0,
      Math.min(count - 1, selectedRef.current + direction),
    );
    activeIndexRef.current = selectedRef.current;
    setActiveIndex(selectedRef.current);
  };
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const lastTransformsRef = useRef(new Map<number, TransformState>());
  const isUpdatingRef = useRef(false);

  const calculateProgress = useCallback(
    (scrollTop: number, start: number, end: number) => {
      if (scrollTop < start) return 0;
      if (scrollTop > end) return 1;
      return (scrollTop - start) / (end - start);
    },
    [],
  );

  const parsePercentage = useCallback(
    (value: string | number, containerHeight: number) => {
      if (typeof value === 'string' && value.includes('%')) {
        return (parseFloat(value) / 100) * containerHeight;
      }
      return parseFloat(String(value));
    },
    [],
  );

  const getScrollData = useCallback(() => {
    return { scrollTop: window.scrollY, containerHeight: window.innerHeight };
  }, []);

  const getElementOffset = useCallback((element: HTMLElement) => {
    let top = 0;
    let current: HTMLElement | null = element;
    while (current) {
      top += current.offsetTop;
      current = current.offsetParent as HTMLElement | null;
    }
    return top;
  }, []);

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    const { scrollTop, containerHeight } = getScrollData();
    const requestedStackPositionPx = parsePercentage(
      stackPosition,
      containerHeight,
    );
    // Keep an equal-height card inside the viewport while it is pinned. This
    // is especially important on narrow screens where cards are intentionally tall.
    const cardHeight = cardsRef.current[0]?.offsetHeight ?? 0;
    const stackPositionPx = Math.min(
      requestedStackPositionPx,
      Math.max(0, containerHeight - cardHeight - 80),
    );
    const scaleEndPositionPx = parsePercentage(
      scaleEndPosition,
      containerHeight,
    );
    const lastCard = cardsRef.current[cardsRef.current.length - 1];
    // Preserve document geometry: the same cards unfold into a horizontal track.
    const morphStart = Math.max(
      getElementOffset(lastCard) - scaleEndPositionPx,
      getElementOffset(lastCard) - stackPositionPx,
    );
    const morphEnd = morphStart + containerHeight * 0.45;
    // Give the finished horizontal track a longer, readable pause before it
    // releases into the next section.
    const pinEnd = morphEnd + containerHeight * 0.5;
    const progress = calculateProgress(scrollTop, morphStart, morphEnd);
    const morph = progress * progress * (3 - 2 * progress);
    const ready = progress === 1;
    if (ready !== browseRef.current) {
      browseRef.current = ready;
      setBrowsing(ready);
    }
    if (progress === 0) {
      selectedRef.current = cardsRef.current.length - 1;
      positionRef.current = selectedRef.current;
      if (activeIndexRef.current !== selectedRef.current) {
        activeIndexRef.current = selectedRef.current;
        setActiveIndex(selectedRef.current);
      }
    }
    const now = performance.now();
    const elapsed = Math.min(64, now - (frameTimeRef.current || now));
    frameTimeRef.current = now;
    positionRef.current +=
      (selectedRef.current - positionRef.current) *
      (1 - Math.exp(-elapsed / 85));
    if (Math.abs(positionRef.current - selectedRef.current) < 0.001)
      positionRef.current = selectedRef.current;
    // Keep the browsing cards at their original size. Center them in the
    // content viewport below the fixed header, rather than the full viewport.
    const browseScale = 1;
    const trackGap = window.innerWidth <= 760 ? 12 : 24;
    const navHeight =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--nav-height',
        ),
      ) || 0;
    const heading = scrollerRef.current
      ?.closest('.work-showcase')
      ?.querySelector<HTMLElement>('.section-heading');
    const headingHeight = heading?.offsetHeight ?? 0;
    const headingGap = heading
      ? parseFloat(getComputedStyle(heading).marginBottom) || 0
      : 0;
    const groupHeight = headingHeight + headingGap + cardHeight * browseScale;
    const groupTop =
      navHeight + Math.max(0, (containerHeight - navHeight - groupHeight) / 2);
    if (heading && window.innerWidth >= 761) {
      heading.style.top = `${groupTop}px`;
    }
    const browsePositionPx = groupTop + headingHeight + headingGap;
    const trackPositionPx =
      stackPositionPx + (browsePositionPx - stackPositionPx) * morph;
    if (controlsRef.current && scrollerRef.current) {
      controlsRef.current.style.top =
        String(
          Math.min(scrollTop, pinEnd) +
            trackPositionPx +
            (cardHeight * browseScale) / 2 -
            getElementOffset(scrollerRef.current),
        ) + 'px';
    }

    cardsRef.current.forEach((card, i) => {
      const cardTop = getElementOffset(card);
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = triggerStart;

      const scaleProgress = calculateProgress(
        scrollTop,
        triggerStart,
        triggerEnd,
      );
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j += 1) {
          const jCardTop = getElementOffset(cardsRef.current[j]);
          const jTriggerStart =
            jCardTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) topCardIndex = j;
        }
        if (i < topCardIndex)
          blur = Math.max(0, (topCardIndex - i) * blurAmount);
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;
      if (isPinned) {
        translateY =
          scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      const trackY = Math.min(scrollTop, pinEnd) - cardTop + trackPositionPx;
      translateY += (trackY - translateY) * morph;
      card.inert = ready && i !== selectedRef.current;
      const nextTransform: TransformState = {
        translateX:
          Math.round(
            (i - positionRef.current) *
              (card.offsetWidth * browseScale + trackGap) *
              morph *
              100,
          ) / 100,
        translateY: Math.round(translateY * 100) / 100,
        scale:
          Math.round((scale + (browseScale - scale) * morph) * 1000) / 1000,
        rotation: Math.round(rotation * (1 - morph) * 100) / 100,
        blur: Math.round(blur * (1 - morph) * 100) / 100,
      };
      const previous = lastTransformsRef.current.get(i);
      const changed =
        !previous ||
        Math.abs(previous.translateX - nextTransform.translateX) > 0.01 ||
        Math.abs(previous.translateY - nextTransform.translateY) > 0.1 ||
        Math.abs(previous.scale - nextTransform.scale) > 0.001 ||
        Math.abs(previous.rotation - nextTransform.rotation) > 0.1 ||
        Math.abs(previous.blur - nextTransform.blur) > 0.1;

      if (changed) {
        card.style.transform = `translate3d(${nextTransform.translateX}px, ${nextTransform.translateY}px, 0) scale(${nextTransform.scale}) rotate(${nextTransform.rotation}deg)`;
        card.style.filter =
          nextTransform.blur > 0 ? `blur(${nextTransform.blur}px)` : '';
        lastTransformsRef.current.set(i, nextTransform);
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });
    isUpdatingRef.current = false;
  }, [
    baseScale,
    blurAmount,
    calculateProgress,
    getElementOffset,
    getScrollData,
    itemScale,
    itemStackDistance,
    onStackComplete,
    parsePercentage,
    rotationAmount,
    scaleEndPosition,
    stackPosition,
  ]);

  useLayoutEffect(() => {
    const root = scrollerRef.current;
    const cards = Array.from(
      root?.querySelectorAll('.scroll-stack-card') ?? [],
    ) as HTMLElement[];
    cardsRef.current = cards;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
      card.style.willChange = 'transform, filter';
      card.style.transformOrigin = 'top center';
      card.style.perspective = '1000px';
      card.style.setProperty('-webkit-perspective', '1000px');
    });

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const clearFrame = () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
    const clearTransforms = () => {
      cards.forEach((card) => {
        card.style.transform = '';
        card.style.filter = '';
        card.inert = false;
      });
      lastTransformsRef.current.clear();
      browseRef.current = false;
      setBrowsing(false);
    };

    const handleScroll = () => updateCardTransforms();
    const handleResize = () => {
      lastTransformsRef.current.clear();
      updateCardTransforms();
    };
    const start = () => {
      if (reducedMotion.matches) {
        clearTransforms();
        return;
      }
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleResize, { passive: true });

      // The page-level Lenis instance updates window.scrollY on its own RAF.
      // Sampling once per frame keeps this stack in sync without another Lenis.
      const raf = () => {
        updateCardTransforms();
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);
      updateCardTransforms();
    };
    const stop = () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      clearFrame();
      clearTransforms();
    };
    const handleMotionPreference = () => {
      stop();
      start();
    };

    reducedMotion.addEventListener('change', handleMotionPreference);
    start();

    return () => {
      reducedMotion.removeEventListener('change', handleMotionPreference);
      stop();
      cards.forEach((card) => {
        card.style.marginBottom = '';
        card.style.transform = '';
        card.style.filter = '';
        card.style.willChange = '';
        card.style.removeProperty('-webkit-perspective');
      });
      const heading = root
        ?.closest('.work-showcase')
        ?.querySelector<HTMLElement>('.section-heading');
      if (heading) heading.style.top = '';
      stackCompletedRef.current = false;
      cardsRef.current = [];
      lastTransformsRef.current.clear();
      isUpdatingRef.current = false;
    };
  }, [itemDistance, updateCardTransforms]);

  return (
    <div
      className={`scroll-stack relative w-full overflow-visible ${className}`.trim()}
      ref={scrollerRef}
    >
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" aria-hidden="true" />
      </div>
      <div
        ref={controlsRef}
        className="scroll-stack-controls"
        hidden={!browsing}
      >
        <button
          type="button"
          aria-label={previousLabel}
          disabled={activeIndex === 0}
          onClick={() => selectCard(-1)}
        >
          ←
        </button>
        <button
          type="button"
          aria-label={nextLabel}
          disabled={activeIndex === count - 1}
          onClick={() => selectCard(1)}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default ScrollStack;
