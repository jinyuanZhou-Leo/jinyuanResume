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
