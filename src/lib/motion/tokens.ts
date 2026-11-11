/**
 * Motion tokens for GSAP, mirroring the motion section of
 * src/styles/tokens.css. Scroll-scrubbed tweens use `ease.none` or one of the
 * named transition curves; time-based entrances use `ease.enter`.
 */
export const ease = {
  /** Scrubbed progress that should track the scrollbar exactly. */
  none: 'none',
  /** Things arriving: text lines, cards, counters. Matches --ease-out. */
  enter: 'expo.out',
  /** Softer arrival for secondary elements. */
  soft: 'power3.out',
  /** Moves between two resting states (rules, rails, travel). */
  travel: 'expo.inOut',
  /** An incoming page flattening its edge as it lands. */
  land: 'power2.in',
  /** The page underneath settling back; stays subtle until mostly covered. */
  settle: 'power2.in',
  /** Small playful overshoot for markers and dots. */
  pop: 'back.out(2.2)',
} as const;

/** Seconds. Mirrors --duration-* in tokens.css, plus longer entrance beats. */
export const duration = {
  fast: 0.3,
  base: 0.4,
  medium: 0.5,
  slow: 0.7,
  slower: 1.1,
  entrance: 1.2,
  travel: 1.4,
} as const;

/** Seconds between siblings in a staggered entrance. */
export const stagger = {
  tight: 0.035,
  base: 0.06,
  loose: 0.08,
  wide: 0.12,
} as const;
