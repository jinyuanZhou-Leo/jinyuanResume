# React Bits adaptations

Source: [React Bits](https://github.com/DavidHDev/react-bits), David Haz.
The upstream MIT + Commons Clause license is preserved in [licenses/react-bits.txt](licenses/react-bits.txt).

## Project overview

Reference: [Grid Motion](https://reactbits.dev/backgrounds/grid-motion).
Upstream source: `src/ts-default/Backgrounds/GridMotion/GridMotion.tsx` and `.css`.

`src/components/ProjectGrid.astro` adapts the tilted, opposing-row composition into a static Astro component generated from the `projects` array. It links each source tile to the matching project card. On desktop, `src/lib/motion/work.ts` adds a second, inert and aria-hidden row plus visual copies that fill both rows, drives the rows in opposite directions from scroll progress with GSAP ScrollTrigger, and leans them with scroll velocity. Cleanup removes every copy. Narrow screens, reduced-motion and print keep the single semantic row in a wrapping grid.

## GitHub background

Reference: [Pixel Blast](https://reactbits.dev/backgrounds/pixel-blast).
The upstream shader implementation is retained in `src/components/interactive/PixelBlast.jsx` with its stylesheet. The GitHub section uses olive green (`#526337`), low opacity and a slow speed to match the site's paper/tea palette. No typography or résumé content is rendered into the canvas.

## Scroll choreography

The page-level `mountMotion` lifecycle in `src/lib/motion/index.ts` owns Lenis, anchor navigation and one GSAP `matchMedia` context; each chapter has its own module. Chapters derive their animations from the rendered records, so adding projects, experiences, schools or skills needs no animation changes.

The GitHub chapter publishes a `--chapter-progress` value on its Astro wrapper while it crosses the viewport, and `PixelBlast.jsx` reads the same progress through ScrollTrigger. CSS controls the wrapper's opacity and centered scale while the shader continues its own paused/offscreen-aware rendering lifecycle. The background remains decorative and never carries résumé text.
