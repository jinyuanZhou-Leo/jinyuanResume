type GalleryPhoto = {
  src: string;
  orientation: 'portrait' | 'landscape';
};

export const galleryPhotos: readonly GalleryPhoto[] = [
  { src: '/images/gallery/IMG_0206.webp', orientation: 'portrait' },
  {
    src: '/images/gallery/IDG_20260828_192729_849.webp',
    orientation: 'landscape',
  },
  { src: '/images/gallery/IMG_2174.webp', orientation: 'portrait' },
  { src: '/images/gallery/IMG_1534.webp', orientation: 'portrait' },
  {
    src: '/images/gallery/IDG_20260622_114006_873.webp',
    orientation: 'landscape',
  },
  {
    src: '/images/gallery/IDG_20260504_121632_708.webp',
    orientation: 'portrait',
  },
  {
    src: '/images/gallery/IDG_20260724_110826_820.webp',
    orientation: 'landscape',
  },
  {
    src: '/images/gallery/IDG_20260905_163033_541.webp',
    orientation: 'portrait',
  },
  {
    src: '/images/gallery/IDG_20260906_145949_872.webp',
    orientation: 'landscape',
  },
  { src: '/images/gallery/IMG_0774.webp', orientation: 'portrait' },
  { src: '/images/gallery/IMG_0909.webp', orientation: 'landscape' },
  { src: '/images/gallery/IMG_1198.webp', orientation: 'landscape' },
  { src: '/images/gallery/IMG_1361.webp', orientation: 'portrait' },
  { src: '/images/gallery/IMG_2491.webp', orientation: 'portrait' },
  { src: '/images/gallery/IMG_7419.webp', orientation: 'landscape' },
  { src: '/images/gallery/IMG_7939.webp', orientation: 'landscape' },
  { src: '/images/gallery/IMG_7518.webp', orientation: 'portrait' },
];

export function galleryMotionStyle(index: number) {
  // Distribute all photos around the circle; adjacent entries point far apart.
  const angle =
    (((index * 7) % galleryPhotos.length) * 2 * Math.PI) / galleryPhotos.length;
  const x = Math.cos(angle) * 2.2;
  const y = Math.sin(angle) * 2.2;
  return `--pan-from-x:${-x.toFixed(2)}%;--pan-from-y:${-y.toFixed(2)}%;--pan-to-x:${x.toFixed(2)}%;--pan-to-y:${y.toFixed(2)}%`;
}
