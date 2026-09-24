import { galleryMotionStyle, galleryPhotos } from '../data/hero-gallery';

const CHANGE_INTERVAL = 4500;
const FADE_DURATION = 1400;

function shuffledIndices(length: number, previous?: number) {
  const indices = Array.from({ length }, (_, index) => index);
  for (let index = indices.length - 1; index > 0; index--) {
    const random = Math.floor(Math.random() * (index + 1));
    [indices[index], indices[random]] = [indices[random], indices[index]];
  }
  if (length > 1 && indices[length - 1] === previous) {
    [indices[0], indices[length - 1]] = [indices[length - 1], indices[0]];
  }
  return indices;
}

export function mountHeroGallery() {
  const gallery = document.querySelector<HTMLElement>('.hero-gallery');
  if (!gallery) return () => {};

  const tiles = [
    ...gallery.querySelectorAll<HTMLElement>('.hero-gallery-tile'),
  ];
  const currentPhotos = tiles.map((tile) => Number(tile.dataset.photoIndex));
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const controller = new AbortController();
  let order = shuffledIndices(tiles.length);
  let timer: number | undefined;
  let fadeTimer: number | undefined;
  let disposed = false;

  const schedule = () => {
    if (disposed || document.hidden || preference.matches) return;
    timer = window.setTimeout(() => void changeOneTile(), CHANGE_INTERVAL);
  };

  const changeOneTile = async () => {
    const tileIndex = order.pop();
    if (tileIndex === undefined) return;
    if (order.length === 0) order = shuffledIndices(tiles.length, tileIndex);

    // Match each tile's portrait or landscape shape without stretching the photo.
    const orientation = galleryPhotos[currentPhotos[tileIndex]].orientation;
    const available = galleryPhotos.flatMap((photo, index) =>
      photo.orientation === orientation && !currentPhotos.includes(index)
        ? [index]
        : [],
    );
    const nextIndex = available[Math.floor(Math.random() * available.length)];
    const nextPhoto = new Image();
    nextPhoto.src = galleryPhotos[nextIndex].src;
    nextPhoto.alt = '';
    nextPhoto.className = 'hero-gallery-photo';
    nextPhoto.style.cssText = galleryMotionStyle(nextIndex);
    nextPhoto.width = orientation === 'portrait' ? 1350 : 1800;
    nextPhoto.height = orientation === 'portrait' ? 1800 : 1350;
    nextPhoto.decoding = 'async';

    try {
      await nextPhoto.decode();
      if (disposed || document.hidden || preference.matches) return;
      const tile = tiles[tileIndex];
      const previous = tile.querySelector<HTMLImageElement>('.is-current');
      tile.append(nextPhoto);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (disposed) return;
          nextPhoto.classList.add('is-current');
          previous?.classList.remove('is-current');
          fadeTimer = window.setTimeout(
            () => previous?.remove(),
            FADE_DURATION,
          );
        });
      });
      currentPhotos[tileIndex] = nextIndex;
    } catch {
      // Keep the current frame when a photo cannot load.
    } finally {
      schedule();
    }
  };

  const resume = () => {
    window.clearTimeout(timer);
    if (!document.hidden && !preference.matches) schedule();
  };
  document.addEventListener('visibilitychange', resume, {
    signal: controller.signal,
  });
  preference.addEventListener('change', resume, { signal: controller.signal });
  schedule();

  return () => {
    disposed = true;
    controller.abort();
    window.clearTimeout(timer);
    window.clearTimeout(fadeTimer);
  };
}
