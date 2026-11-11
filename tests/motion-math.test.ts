import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  clamp,
  easeInOutExpo,
  focusDistance,
  progressBetween,
  reelIndex,
  reelScrollFor,
  scatter,
  travelDuration,
  wrap,
} from '../src/lib/motion/math.ts';
import { projects } from '../src/data/resume.ts';

test('reel positions round-trip between card index and scroll offset', () => {
  for (const count of [1, 2, 5, 9]) {
    const start = 1200;
    const end = start + (count - 1) * 950;
    for (let index = 0; index < count; index++) {
      const y = reelScrollFor(index, count, start, end);
      assert.ok(y >= start && y <= end);
      assert.equal(reelIndex(progressBetween(y, start, end), count), index);
    }
  }
});

test('every project in the data resolves to its own reel stop', () => {
  const stops = projects.map((_, i) =>
    reelScrollFor(i, projects.length, 0, 4000),
  );
  assert.equal(new Set(stops).size, projects.length);
  assert.deepEqual(
    stops,
    [...stops].sort((a, b) => a - b),
  );
});

test('out-of-range inputs are clamped rather than extrapolated', () => {
  assert.equal(reelIndex(-0.4, 5), 0);
  assert.equal(reelIndex(1.6, 5), 4);
  assert.equal(reelScrollFor(9, 3, 100, 300), 300);
  assert.equal(progressBetween(50, 100, 100), 0);
  assert.equal(progressBetween(150, 100, 100), 1);
  assert.equal(clamp(5, 0, 1), 1);
});

test('focus distance is zero at the viewport centre and symmetric', () => {
  assert.equal(focusDistance(720, 1440), 0);
  assert.equal(focusDistance(720 + 360, 1440), -focusDistance(720 - 360, 1440));
  assert.equal(focusDistance(99999, 1440), 1);
  assert.equal(focusDistance(100, 0), 0);
});

test('toolkit scatter is deterministic, bounded and spreads neighbours apart', () => {
  for (let i = 0; i < 24; i++) {
    const a = scatter(i);
    assert.deepEqual(a, scatter(i));
    assert.ok(Math.hypot(a.x, a.y) <= 1.0001);
    assert.ok(Math.abs(a.rotate) <= 35);
    const b = scatter(i + 1);
    assert.ok(Math.hypot(a.x - b.x, a.y - b.y) > 0.3);
  }
});

test('marquee wrapping and anchor easing stay within range', () => {
  assert.equal(wrap(-1050, -1000, 0), -50);
  assert.equal(wrap(10, -1000, 0), -990);
  assert.equal(easeInOutExpo(0), 0);
  assert.equal(easeInOutExpo(1), 1);
  assert.ok(Math.abs(easeInOutExpo(0.5) - 0.5) < 1e-9);
  assert.ok(travelDuration(100) >= 0.9 && travelDuration(1e6) <= 1.9);
});
