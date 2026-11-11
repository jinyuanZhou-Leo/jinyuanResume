/**
 * Tiny value channels from the motion controller to islands. The controller
 * owns every ScrollTrigger; islands subscribe instead of measuring scroll.
 */
export interface Signal {
  get(): number;
  set(value: number): void;
  /** Calls `listener` now and on every change; returns an unsubscribe. */
  subscribe(listener: (value: number) => void): () => void;
}

export function createSignal(initial: number): Signal {
  let value = initial;
  const listeners = new Set<(value: number) => void>();
  return {
    get: () => value,
    set(next) {
      if (next === value) return;
      value = next;
      listeners.forEach((listener) => listener(value));
    },
    subscribe(listener) {
      listeners.add(listener);
      listener(value);
      return () => listeners.delete(listener);
    },
  };
}

/** The GitHub chapter's passage through the viewport, 0 → 1 (0.5 at rest). */
export const githubProgress = createSignal(0.5);
