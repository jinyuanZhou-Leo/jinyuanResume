# React Bits adaptations

Source: [React Bits](https://github.com/DavidHDev/react-bits), David Haz.
The upstream MIT + Commons Clause license is preserved in [licenses/react-bits.txt](licenses/react-bits.txt).

## Project overview

Reference: [Grid Motion](https://reactbits.dev/backgrounds/grid-motion).
Upstream source: `src/ts-default/Backgrounds/GridMotion/GridMotion.tsx` and `.css`.

`src/components/ProjectGrid.astro` adapts the tilted, opposing-row composition into a static Astro component. It displays all five actual projects, linking to the detailed entries below. Motion drives row positions from scroll progress instead of adding GSAP's pointer-driven ticker. This reuses the site's existing scroll lifecycle and retains keyboard-accessible project links. Reduced-motion and print modes show an unrotated, wrapping grid.

## GitHub background

Reference: [Pixel Blast](https://reactbits.dev/backgrounds/pixel-blast).
The upstream shader implementation is retained in `src/components/interactive/PixelBlast.jsx` with its stylesheet. The GitHub section uses olive green (`#526337`), low opacity and a slow speed to match the site's paper/tea palette. No typography or résumé content is rendered into the canvas.

## Scroll chapters

Desktop project rows now travel 960px across their scroll interval; the enlarged overview precedes its headline. Experience uses a dedicated scroll timeline with compact 18px item padding. About uses three mutually exclusive panels (education, technology, other abilities), with explicit 0/1 timeline endpoints to prevent inactive content from reappearing. Open Source has a 220svh reading runway: the first phase shows Pixel Blast, then its headline and repositories enter. The shader receives the same chapter progress and varies time, pixel size, scale and density. These chapter timelines are defined in `src/lib/chapters.ts` and `src/styles/reading-sequence.css`. Mobile and reduced-motion layouts preserve linear reading order.

The overview now has a 280svh desktop scroll runway with feathered top/bottom edges. Pixel Blast retains its stronger olive field through 40% of the chapter, then interpolates its shader color toward gray from 45–92% while reducing opacity from 0.48 to 0.14 after the repository reveal.
