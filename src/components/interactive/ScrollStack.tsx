import {
  Children,
  isValidElement,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { buildStackLayout, progressBetween } from '../../lib/stack-layout';
import {
  getElementTop,
  registerScrollStops,
  notifyScrollStops,
} from '../../lib/scroll-stops';
import './ScrollStack.css';

export function ScrollStackItem({
  children,
  itemClassName = '',
  id,
}: {
  children: ReactNode;
  itemClassName?: string;
  id?: string;
}) {
  return (
    <div id={id} className={`scroll-stack-card ${itemClassName}`}>
      {children}
    </div>
  );
}
interface Props {
  children: ReactNode;
  className?: string;
  itemDistance?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  previousLabel?: string;
  nextLabel?: string;
}

export default function ScrollStack({
  children,
  className = '',
  itemDistance = 90,
  itemStackDistance = 26,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.88,
  previousLabel = 'Previous project',
  nextLabel = 'Next project',
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<(direction: number) => void>(() => {});
  const [activeIndex, setActiveIndex] = useState(0);
  const [browsing, setBrowsing] = useState(false);
  const count = Children.count(children);
  const identity = Children.toArray(children)
    .map((child) => (isValidElement(child) ? child.key : ''))
    .join('|');

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cards = [...root.querySelectorAll<HTMLElement>('.scroll-stack-card')];
    const heading = root
      .closest('.work-showcase')
      ?.querySelector<HTMLElement>('.section-heading');
    const scene = root.closest<HTMLElement>('.scroll-scene');
    const header = document.querySelector<HTMLElement>('.site-header');
    const media = window.matchMedia('(prefers-reduced-motion: reduce), print');
    let frame = 0,
      needsMeasure = true,
      disposed = false;
    let selected = Math.max(0, cards.length - 1),
      position = selected,
      lastTime = 0,
      ready = false;
    let stops: number[] = [];
    let geometry:
      | {
          layout: ReturnType<typeof buildStackLayout>;
          tops: number[];
          widths: number[];
          height: number;
          rootTop: number;
          headingTop: number;
          scaleEnd: number;
          desktop: boolean;
        }
      | undefined;
    const transforms = new Map<HTMLElement, string>();
    const setTransform = (el: HTMLElement, value: string) => {
      if (transforms.get(el) !== value) {
        el.style.transform = value;
        transforms.set(el, value);
      }
    };
    const parsePosition = (value: string) =>
      parseFloat(value) * (value.endsWith('%') ? window.innerHeight / 100 : 1);
    const clear = () => {
      cards.forEach((card) => {
        card.style.transform = '';
        card.style.filter = '';
        card.inert = false;
      });
      if (heading) {
        heading.style.position = '';
        heading.style.transform = '';
        heading.style.top = '';
      }
      transforms.clear();
      ready = false;
      setBrowsing(false);
    };
    // Geometry reads run only after content, viewport or font metrics change.
    const measure = () => {
      const desktop = window.innerWidth >= 761;
      if (heading) {
        heading.style.position = desktop ? 'relative' : '';
        heading.style.top = desktop ? '0px' : '';
      }
      root.style.removeProperty('--stack-card-height');
      const height = Math.max(0, ...cards.map((card) => card.offsetHeight));
      if (height) root.style.setProperty('--stack-card-height', `${height}px`);
      const tops = cards.map(getElementTop);
      const widths = cards.map((card) => card.offsetWidth);
      const headingTop = heading ? getElementTop(heading) : getElementTop(root);
      const scaleEnd = parsePosition(scaleEndPosition);
      const layout = buildStackLayout({
        viewport: window.innerHeight,
        nav: header?.offsetHeight ?? 0,
        desktop: desktop && !!heading,
        headingTop,
        headingHeight: heading?.offsetHeight ?? 0,
        headingGap: heading
          ? parseFloat(getComputedStyle(heading).marginBottom) || 0
          : 0,
        cardHeight: height,
        cardTops: tops,
        stackPosition: parsePosition(stackPosition),
        scaleEnd,
        stackDistance: itemStackDistance,
      });
      geometry = {
        layout,
        tops,
        widths,
        height,
        rootTop: getElementTop(root),
        headingTop,
        scaleEnd,
        desktop,
      };
      stops = layout.stops;
      needsMeasure = false;
      notifyScrollStops();
    };
    const render = (time: number) => {
      frame = 0;
      if (disposed || media.matches) return;
      if (needsMeasure) measure();
      if (!geometry || !cards.length) return;
      const {
        layout: g,
        tops,
        widths,
        height,
        rootTop,
        headingTop,
        scaleEnd,
        desktop,
      } = geometry;
      const y = window.scrollY;
      const progress = progressBetween(y, g.morphStart, g.morphEnd);
      const morph = progress * progress * (3 - 2 * progress);
      const nextReady = progress === 1;
      if (nextReady !== ready) {
        ready = nextReady;
        setBrowsing(ready);
      }
      if (!progress && selected !== cards.length - 1) {
        selected = cards.length - 1;
        position = selected;
        setActiveIndex(selected);
      }
      const elapsed = Math.min(64, time - (lastTime || time));
      lastTime = time;
      position += (selected - position) * (1 - Math.exp(-elapsed / 85));
      if (Math.abs(position - selected) < 0.001) position = selected;
      const scale = desktop ? 0.86 : 0.8;
      const gap = desktop ? 24 : 12;
      const trackY =
        g.stackPosition + (g.browsePosition - g.stackPosition) * morph;
      if (heading)
        setTransform(
          heading,
          desktop
            ? `translate3d(0,${Math.max(0, Math.min(y, g.pinEnd) + g.groupTop - headingTop)}px,0)`
            : '',
        );
      if (controlsRef.current)
        setTransform(
          controlsRef.current,
          `translate3d(0,${Math.min(y, g.pinEnd) + trackY + (height * scale) / 2 - rootTop}px,0) translateY(-50%)`,
        );
      cards.forEach((card, i) => {
        const growth = cards.length < 2 ? 1 : i / (cards.length - 1);
        const targetScale = baseScale + growth * (1 - baseScale);
        const stackScale =
          1 -
          progressBetween(y, g.triggers[i], tops[i] - scaleEnd) *
            (1 - targetScale);
        const pinned = Math.max(
          0,
          Math.min(y, g.pinEnd) -
            tops[i] +
            g.stackPosition +
            itemStackDistance * i,
        );
        const translation =
          pinned + (Math.min(y, g.pinEnd) - tops[i] + trackY - pinned) * morph;
        setTransform(
          card,
          `translate3d(${((i - position) * (widths[i] * scale + gap) * morph).toFixed(2)}px,${translation.toFixed(2)}px,0) scale(${(stackScale + (scale - stackScale) * morph).toFixed(4)})`,
        );
        const filter = morph
          ? `blur(${(Math.min(3, Math.abs(i - position) * 2) * morph).toFixed(2)}px)`
          : '';
        if (card.style.filter !== filter) card.style.filter = filter;
        card.inert = ready && i !== selected;
      });
      // Selection interpolation needs a few more frames; a settled stack is idle.
      if (position !== selected) schedule();
    };
    const schedule = () => {
      if (!frame && !disposed && !media.matches)
        frame = requestAnimationFrame(render);
    };
    const resize = () => {
      needsMeasure = true;
      schedule();
    };
    const preference = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      clear();
      needsMeasure = true;
      schedule();
    };
    cards.forEach(
      (card, i) =>
        (card.style.marginBottom =
          i < cards.length - 1 ? `${itemDistance}px` : ''),
    );
    setActiveIndex(selected);
    selectRef.current = (direction) => {
      selected = Math.max(0, Math.min(cards.length - 1, selected + direction));
      setActiveIndex(selected);
      lastTime = 0;
      schedule();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(root);
    if (header) observer.observe(header);
    if (heading) observer.observe(heading);
    cards.forEach((card) => observer.observe(card));
    const main = document.querySelector('main');
    if (main) observer.observe(main);
    const unregister = scene
      ? registerScrollStops(scene, () => stops)
      : () => {};
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    media.addEventListener('change', preference);
    void document.fonts.ready.then(() => {
      if (!disposed) resize();
    });
    schedule();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      unregister();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resize);
      media.removeEventListener('change', preference);
      clear();
      root.style.removeProperty('--stack-card-height');
      cards.forEach((card) => (card.style.marginBottom = ''));
      selectRef.current = () => {};
    };
  }, [
    identity,
    itemDistance,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
  ]);

  return (
    <div className={`scroll-stack ${className}`} ref={rootRef}>
      <div className="scroll-stack-inner">{children}</div>
      <div
        ref={controlsRef}
        className="scroll-stack-controls"
        hidden={!browsing || count < 2}
      >
        <button
          type="button"
          aria-label={previousLabel}
          disabled={activeIndex === 0}
          onClick={() => selectRef.current(-1)}
        >
          ←
        </button>
        <button
          type="button"
          aria-label={nextLabel}
          disabled={activeIndex === count - 1}
          onClick={() => selectRef.current(1)}
        >
          →
        </button>
      </div>
    </div>
  );
}
