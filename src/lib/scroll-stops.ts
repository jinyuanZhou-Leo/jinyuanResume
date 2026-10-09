/** Chapters publish their own measured stops; snapping never reimplements their timelines. */
const providers = new Map<HTMLElement, () => readonly number[]>();
const anchorTargets = new Map<HTMLElement, () => number>();
export const SCROLL_STOPS_CHANGED = 'resume:scroll-stops-changed';
export const ANCHOR_NAVIGATION = 'resume:anchor-navigation';
export const NAVIGATE_TO = 'resume:navigate-to';
export function registerAnchorTarget(
  element: HTMLElement,
  resolve: () => number,
) {
  anchorTargets.set(element, resolve);
  return () => {
    if (anchorTargets.get(element) === resolve) anchorTargets.delete(element);
  };
}
export function getAnchorTop(element: HTMLElement) {
  const resolve = anchorTargets.get(element);
  if (resolve) return resolve();
  const padding =
    parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) ||
    0;
  return Math.max(0, getElementTop(element) - padding);
}
/** All programmatic navigation goes through the page's active scroll controller. */
export function navigateTo(target: HTMLElement | number) {
  document.dispatchEvent(new CustomEvent(NAVIGATE_TO, { detail: target }));
}
export function notifyScrollStops() {
  window.dispatchEvent(new Event(SCROLL_STOPS_CHANGED));
}
export function registerScrollStops(
  owner: HTMLElement,
  measure: () => readonly number[],
) {
  providers.set(owner, measure);
  notifyScrollStops();
  return () => {
    if (providers.get(owner) === measure) providers.delete(owner);
    notifyScrollStops();
  };
}
export function getElementTop(element: HTMLElement): number {
  let top = 0;
  for (
    let current: HTMLElement | null = element;
    current;
    current = current.offsetParent as HTMLElement | null
  )
    top += current.offsetTop;
  return top;
}
export function getChapterStops(
  scene: HTMLElement,
  navHeight: number,
): readonly number[] {
  const provider = providers.get(scene);
  if (provider) return provider();
  const anchors = [
    ...scene.querySelectorAll<HTMLElement>('[data-reading-stop]'),
  ];
  return (anchors.length ? anchors : [scene]).map(
    (el) => getElementTop(el) - navHeight,
  );
}
