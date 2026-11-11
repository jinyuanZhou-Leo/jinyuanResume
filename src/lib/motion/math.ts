/** Pure helpers shared by the scroll choreography. No DOM access. */

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** Linear progress of `value` between `start` and `end`, clamped to 0–1. */
export function progressBetween(value: number, start: number, end: number) {
  if (end === start) return value >= end ? 1 : 0;
  return clamp((value - start) / (end - start), 0, 1);
}

/** Index of the card nearest to a reel's progress, for `count` evenly spaced cards. */
export function reelIndex(progress: number, count: number) {
  if (count < 2) return 0;
  return clamp(Math.round(progress * (count - 1)), 0, count - 1);
}

/**
 * Scroll offset at which card `index` is centred in a pinned horizontal reel
 * whose cards are evenly spaced and whose first and last cards rest centred.
 */
export function reelScrollFor(
  index: number,
  count: number,
  start: number,
  end: number,
) {
  if (count < 2) return start;
  return start + (clamp(index, 0, count - 1) / (count - 1)) * (end - start);
}

/**
 * Signed distance of a card's centre from the viewport centre, in viewport
 * widths, clamped to −1…1. Drives focus scale, dimming and parallax.
 */
export function focusDistance(cardCenter: number, viewport: number) {
  if (viewport <= 0) return 0;
  return clamp((cardCenter - viewport / 2) / viewport, -1, 1);
}

/**
 * Deterministic scatter for the toolkit icons: points spread on a golden-angle
 * spiral so neighbours fly in from far-apart directions. Units are −1…1.
 */
export function scatter(index: number) {
  const angle = index * 2.399963;
  const radius = 0.55 + 0.45 * ((index * 0.618034) % 1);
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    rotate: ((index * 47) % 70) - 35,
  };
}

/** Wrap `value` into [min, max). Used by the endless marquee. */
export function wrap(value: number, min: number, max: number) {
  const span = max - min;
  if (span <= 0) return min;
  return ((((value - min) % span) + span) % span) + min;
}

/** Duration in seconds for a programmatic scroll covering `distance` pixels. */
export function travelDuration(distance: number) {
  return clamp(Math.abs(distance) / 2600, 0.9, 1.9);
}

/** Exponential in-out easing for long anchor journeys. */
export function easeInOutExpo(t: number) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t < 0.5
    ? Math.pow(2, 20 * t - 10) / 2
    : (2 - Math.pow(2, -20 * t + 10)) / 2;
}
