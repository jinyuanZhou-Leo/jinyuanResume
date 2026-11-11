# Design system

The site's visual language is defined as tokens in two places. Both describe one system:

- `src/styles/tokens.css` defines the CSS custom properties that every stylesheet uses.
- `src/lib/motion/tokens.ts` holds the same motion vocabulary for GSAP.

## Tiers

1. **Primitives** are raw values: `--olive-*` (warm greys), `--tea-*` (the single green accent) and font stacks. Components never use them directly. Change a primitive to retune the whole site.
2. **Semantic tokens** describe what a value is for. Components use only these:
   - colour: `--color-*`, `--color-inverse-*` and `--art-*`
   - type: `--type-*`, `--weight-*`, `--leading-*` and `--tracking-*`
   - space: `--space-*`, `--gutter` and `--max-width`
   - shape: `--radius-*` and `--shadow-*`
   - motion: `--ease-*` and `--duration-*`
   - layers: `--z-*`
3. **Chapter tones** (`--tone-bg`, `--tone-ink`, `--tone-muted` and `--tone-line`) are remapped by `data-tone` on a chapter. `muted` is used for Experience and `inverse` is available for dark pages. Text and rules inside a chapter read `--tone-*`, so they follow its surface.

Older names (`--paper`, `--ink`, `--accent`, `--ease`, `--text-body` and so on) remain as aliases of semantic tokens. New code should use the semantic names.

## Colour

| Token                 | Use                                                      |
| --------------------- | -------------------------------------------------------- |
| `--color-bg`          | Page paper                                               |
| `--color-bg-raised`   | Quiet panels, toolkit tiles                              |
| `--color-bg-muted`    | Experience chapter                                       |
| `--color-bg-sunken`   | Behind the hero photographs                              |
| `--color-fill`        | Hover fills, artwork backgrounds                         |
| `--color-ink`         | Primary text                                             |
| `--color-ink-soft`    | Secondary text on light photographic backgrounds         |
| `--color-muted`       | Captions, metadata                                       |
| `--color-line`        | Hairlines and rails                                      |
| `--color-accent`      | The one green: active states, rails, indices, the period |
| `--color-accent-soft` | Selection, highlights on dark                            |
| `--color-inverse-*`   | The footer page                                          |
| `--art-*`             | Colours that only appear inside project illustrations    |

There is one accent. Green marks state and progress, never decoration.

## Type

Manrope with Noto Sans SC as the Chinese fallback, at three weights: 400, 600 and 700.

| Token              | Size     | Use                                      |
| ------------------ | -------- | ---------------------------------------- |
| `--type-display`   | 76–116px | Name in the hero                         |
| `--type-marquee`   | 44–120px | Footer ticker                            |
| `--type-h2-lg`     | 32–56px  | Toolkit, contact                         |
| `--type-h2`        | 32–52px  | Chapter titles                           |
| `--type-subhead`   | 23–34px  | Hero line                                |
| `--type-h3-lg`     | 24–38px  | School names                             |
| `--type-h3`        | 24–32px  | Project names                            |
| `--type-lede`      | 17–22px  | About paragraph                          |
| `--type-h4`        | 16–24px  | Drift tile captions                      |
| `--type-lead`      | 16px     | Hero greeting, repo names                |
| `--type-body`      | 14px     | Body copy                                |
| `--type-ui`        | 13px     | Buttons, navigation                      |
| `--type-small`     | 12px     | Metadata                                 |
| `--type-caption`   | 11px     | Eyebrows (upper case, `--tracking-caps`) |
| `--type-micro`     | 10px     | Indices, artwork labels                  |

Headings use negative tracking (`--tracking-heading`/`--tracking-title`). Titles carry no full stop. The green period after the name in the hero is the one exception: it is the brand mark.

## Space and shape

- **Space** uses a 4px base: `--space-1` (4px) through `--space-11` (80px), with `--space-section` at 110px for vertical chapter padding. Horizontal page margins use `--gutter`.
- **Radius** has six steps:
  - `--radius-xs` (4px): controls
  - `--radius-sm` (8px): artwork windows and glyphs
  - `--radius-md` (12px): tiles and visuals
  - `--radius-lg` (18px): project cards
  - `--radius-sheet` (40px): the top edge of a page while it slides in
  - `--radius-full`: dots and circular buttons
- **Shadows** are rare:
  - `--shadow-object`/`--shadow-float`: illustrated objects
  - `--shadow-sheet`: an incoming page
  - `--shadow-stone`: Reversi stones

## Motion

| CSS                 | GSAP (`tokens.ts`) | Use                                                   |
| ------------------- | ------------------ | ----------------------------------------------------- |
| `--ease-out`        | `ease.enter`       | Anything arriving: lines, cards, counters             |
|                     | `ease.soft`        | Secondary arrivals                                    |
| `--ease-in-out`     | `ease.travel`      | Moving between two rests: rules, rails, scroll travel |
|                     | `ease.land`        | An incoming page flattening its edge                  |
|                     | `ease.settle`      | The covered page sinking back                         |
|                     | `ease.pop`         | Markers and dots                                      |
| `--duration-fast`   | `duration.fast`    | 0.3s: colour and hover                                |
| `--duration-base`   | `duration.base`    | 0.4s: small movement                                  |
| `--duration-medium` | `duration.medium`  | 0.5s                                                  |
| `--duration-slow`   | `duration.slow`    | 0.7s: card copy, artwork hover                        |
| `--duration-slower` | `duration.slower`  | 1.1s: line reveals                                    |

Scroll-scrubbed tweens use `ease: 'none'` unless the motion has a physical reason to accelerate.

### Chapter transitions

Every chapter boundary follows one rule, the page stack (`src/lib/motion/stack.ts`):

1. A chapter holds still once its last line reaches the bottom of the screen.
2. The next chapter slides up over it. Its top edge starts at `--radius-sheet` and flattens as it lands.
3. The covered chapter scales to 94% around its visible centre and darkens under an ink veil of up to 45%. Once it is fully covered, it stops painting.

The hero is the first page in the stack and the dark footer is the last. Inside the Work chapter, the tilted overview straightens and fades as the ordered reel arrives.

The stack runs only on desktop with motion enabled. On mobile, with reduced motion and in print, chapters sit in normal flow.
