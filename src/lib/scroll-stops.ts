/** Chapters publish their own measured stops; snapping never reimplements their timelines. */
const providers = new Map<HTMLElement, () => readonly number[]>();
export const SCROLL_STOPS_CHANGED = 'resume:scroll-stops-changed';
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
