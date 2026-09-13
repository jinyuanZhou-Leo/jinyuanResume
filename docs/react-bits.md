# React Bits adaptations

Source: [React Bits](https://github.com/DavidHDev/react-bits), David Haz.
The upstream MIT + Commons Clause license is preserved in [licenses/react-bits.txt](licenses/react-bits.txt).

## Project overview

Reference: [Grid Motion](https://reactbits.dev/backgrounds/grid-motion).
Upstream source: `src/ts-default/Backgrounds/GridMotion/GridMotion.tsx` and `.css`.

`src/components/ProjectGrid.astro` adapts the tilted, opposing-row composition into a static Astro component generated from the `projects` array. It links each source tile to the matching detailed project entry. The desktop-only `mountProjectOverview` lifecycle adds inert, aria-hidden visual copies after measuring the single semantic row, then restores that row during cleanup. Motion drives row positions from scroll progress without a pointer-driven ticker. Reduced-motion and print modes keep the semantic project list in a wrapping layout.

## GitHub background

Reference: [Pixel Blast](https://reactbits.dev/backgrounds/pixel-blast).
The upstream shader implementation is retained in `src/components/interactive/PixelBlast.jsx` with its stylesheet. The GitHub section uses olive green (`#526337`), low opacity and a slow speed to match the site's paper/tea palette. No typography or résumé content is rendered into the canvas.

## Scroll chapters

The page-level `mountMotion` lifecycle coordinates the project overview, chapter animations, background handoff and Lenis cleanup. `chapters.ts`, `about-journey.ts` and `ScrollStack.tsx` derive their timelines from the rendered records and register measured stops through `registerScrollStops` in `src/lib/scroll-stops.ts`. Semantic records use `data-reading-stop` as the shared fallback marker; the snap controller consumes chapter registrations when available and otherwise resolves those markers, instead of maintaining a second item-count or phase list. This keeps added experiences, schools and abilities readable without changing animation code. Mobile and reduced-motion layouts preserve linear reading order.

The GitHub section supplies one chapter progress value to its Pixel Blast wrapper. CSS controls the wrapper's opacity and centered scale while the shader continues its own paused/offscreen-aware rendering lifecycle. The background remains decorative and never carries résumé text.
