import type Lenis from 'lenis';

export type Cleanup = () => void;

/** Shared context handed to each chapter while motion is active. */
export interface MotionScope {
  desktop: boolean;
  lenis: Lenis;
  /** Chapters that move content off its layout position resolve their own anchors. */
  registerAnchor(resolve: (element: HTMLElement) => number | undefined): void;
  navigate(target: HTMLElement | number, immediate?: boolean): void;
}
