import { scroll } from 'motion';
import { getElementTop } from './scroll-stops';

/** Desktop-only stream. Cleanup restores the single semantic project list. */
export function mountProjectOverview() {
  const work = document.querySelector<HTMLElement>('#work');
  const layer = work?.querySelector<HTMLElement>('.work-overview-layer');
  const showcase = work?.querySelector<HTMLElement>('.work-showcase');
  const grid = work?.querySelector<HTMLElement>('.project-grid-tilt');
  const originalRow = grid?.querySelector<HTMLElement>('[data-grid-row]');
  if (
    !work ||
    !layer ||
    !showcase ||
    !grid ||
    !originalRow ||
    !originalRow.children.length
  )
    return () => {};
  const originals = [...originalRow.children] as HTMLElement[];
  const rows: HTMLElement[] = [];
  let workTop = 0,
    nav = 0,
    distance = 1,
    cycleWidth = 1;
  const render = () => {
    const delta = window.scrollY - (workTop - nav);
    const progress = Math.max(0, Math.min(1, delta / distance));
    rows.forEach((row, i) => {
      const drift = (i % 2 ? 1 : -1) * delta * 0.55;
      const x = (((drift % cycleWidth) + cycleWidth) % cycleWidth) - cycleWidth;
      row.style.transform = `translate3d(${x}px,0,0)`;
    });
    const ease = (value: number) => {
      const t = Math.max(0, Math.min(1, value));
      return t * t * (3 - 2 * t);
    };
    const fade = ease((progress - 0.05) / 0.3);
    layer.style.opacity = String(1 - fade);
    layer.style.visibility = fade === 1 ? 'hidden' : 'visible';
    const enter = ease((progress - 0.35) / 0.55);
    showcase.style.opacity = String(enter);
    showcase.style.transform =
      enter === 1
        ? ''
        : `translate3d(0,${(1 - enter) * 30}px,0) scale(${0.98 + enter * 0.02})`;
    showcase.inert = enter < 0.6;
  };
  const measure = () => {
    workTop = getElementTop(work);
    nav =
      document.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 0;
    distance =
      work.querySelector<HTMLElement>('.work-intro-spacer')?.offsetHeight ||
      window.innerHeight;
    const gap = parseFloat(getComputedStyle(originalRow).columnGap) || 0;
    cycleWidth = (originals[0].offsetWidth + gap) * originals.length;
    render();
  };
  // At least two viewport widths of copies also covers a one-project portfolio.
  const tileWidth = originals[0].offsetWidth || 240;
  const cycles = Math.max(
    4,
    Math.ceil((window.innerWidth * 2) / (tileWidth * originals.length)) + 2,
  );
  for (let r = 0; r < 4; r++) {
    const row = r === 0 ? originalRow : document.createElement('div');
    row.className = 'project-grid-row';
    row.dataset.gridRow = String(r);
    if (r > 0) {
      row.inert = true;
      row.setAttribute('aria-hidden', 'true');
      grid.append(row);
    }
    for (
      let i = r === 0 ? originals.length : 0;
      i < originals.length * cycles;
      i++
    ) {
      const copy = originals[(i + r * 2) % originals.length].cloneNode(
        true,
      ) as HTMLElement;
      copy.inert = true;
      copy.setAttribute('aria-hidden', 'true');
      copy.tabIndex = -1;
      row.append(copy);
    }
    rows.push(row);
  }
  measure();
  const observer = new ResizeObserver(measure);
  observer.observe(work);
  observer.observe(originals[0]);
  observer.observe(document.querySelector('.site-header')!);
  window.addEventListener('resize', measure);
  const stop = scroll(render);
  return () => {
    stop();
    observer.disconnect();
    window.removeEventListener('resize', measure);
    originalRow.replaceChildren(...originals);
    grid.replaceChildren(originalRow);
    originalRow.style.transform = '';
    layer.style.opacity = '';
    layer.style.visibility = '';
    showcase.style.opacity = '';
    showcase.style.transform = '';
    showcase.inert = false;
  };
}
