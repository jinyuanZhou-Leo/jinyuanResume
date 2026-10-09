import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  buildAboutTimeline,
  buildExperienceTimeline,
  skillLayout,
} from '../src/lib/chapter-timeline.ts';
import { buildStackLayout, progressBetween } from '../src/lib/stack-layout.ts';
import {
  projects,
  experiences,
  education,
  abilities,
} from '../src/data/resume.ts';

function ordered(stops: readonly number[]) {
  assert.ok(
    stops.every(
      (p, i) =>
        Number.isFinite(p) &&
        p >= 0 &&
        p <= 1 &&
        (i === 0 || p >= stops[i - 1]),
    ),
  );
}
test('every school and ability receives a readable stop after adding or removing records', () => {
  for (const count of [0, 1, 2, 3, 8])
    for (const people of [0, 1, 5, 6, 10]) {
      const t = buildAboutTimeline(count, people, true);
      ordered(t.stops);
      assert.equal(t.schools.length, count);
      assert.equal(t.abilities.length, people);
      for (const b of [...t.schools, ...t.abilities])
        assert.ok(
          t.stops.includes(b.read) && b.read > b.enter && b.read < b.leave,
        );
    }
});
test('each experience can finish all its lines before its reading and exit stops', () => {
  for (const counts of [[], [1], [8], [4, 12, 6], [20, 3]]) {
    const t = buildExperienceTimeline(counts);
    ordered(t.stops);
    assert.equal(t.entries.length, counts.length);
    for (const entry of t.entries) {
      assert.ok(entry.lines.every((line) => line.end <= entry.read));
      assert.ok(entry.read < entry.leave);
      assert.ok(entry.end <= t.releaseStart);
    }
  }
});
test('skill positions remain finite and unique beyond nine skills', () => {
  for (const count of [0, 1, 9, 10, 12, 25]) {
    const layout = skillLayout(count);
    assert.equal(layout.positions.length, count);
    assert.equal(
      new Set(layout.positions.map((p) => `${p.x},${p.y}`)).size,
      count,
    );
    assert.ok(
      layout.positions.every(
        (p) =>
          Number.isFinite(p.x) &&
          Number.isFinite(p.y) &&
          p.x > 0 &&
          p.x < 100 &&
          p.y > 0 &&
          p.y < 100,
      ),
    );
  }
});
test('stack stops are generated from actual card geometry, including zero and one card', () => {
  for (const count of [0, 1, 5, 8]) {
    const m = {
      viewport: 900,
      nav: 92,
      desktop: true,
      headingTop: 1100,
      headingHeight: 100,
      headingGap: 24,
      cardHeight: 558,
      browseScale: 0.86,
      cardTops: Array.from({ length: count }, (_, i) => 1250 + i * 648),
      stackPosition: 180,
      scaleEnd: 90,
      stackDistance: 26,
    };
    const g = buildStackLayout(m);
    assert.ok(g.stops.every(Number.isFinite));
    assert.equal(g.triggers.length, count);
    if (count) {
      assert.ok(g.pinEnd > g.morphEnd && g.morphEnd > g.morphStart);
      assert.ok(g.stops.includes(g.pinEnd));
    }
  }
  assert.equal(progressBetween(5, 5, 5), 1);
});
test('tall projects finish vertical reading before stacking and carousel release', () => {
  for (const [viewport, nav, cardHeight, desktop] of [
    [568, 108, 932, false],
    [375, 108, 1200, false],
    [375, 92, 520, true],
    [720, 92, 1040, true],
    [900, 92, 558, true],
  ] as const) {
    const cardTops = Array.from(
      { length: 5 },
      (_, i) => 1250 + i * (cardHeight + 90),
    );
    const m = {
      viewport,
      nav,
      desktop,
      cardHeight,
      cardTops,
      headingTop: 1100,
      headingHeight: 100,
      headingGap: 24,
      browseScale: desktop ? 0.86 : 0.8,
      stackPosition: viewport * 0.2,
      scaleEnd: viewport * 0.1,
      stackDistance: 26,
    };
    const g = buildStackLayout(m);
    for (const [i, trigger] of g.triggers.entries()) {
      // At pinning, even the unscaled bottom has already entered the viewport.
      assert.ok(cardTops[i] - trigger + cardHeight <= viewport - 16);
      const start = cardTops[i] - nav - 16;
      if (trigger > start) {
        const stops = g.stops.filter(
          (stop) => stop >= start && stop <= trigger,
        );
        assert.equal(stops[0], start);
        assert.equal(stops.at(-1), trigger);
        assert.ok(
          stops.every(
            (stop, j) =>
              j === 0 || stop - stops[j - 1] <= viewport - nav - 32 + 0.01,
          ),
        );
      }
    }
    assert.ok(
      g.browsePosition - g.browseOverflow + cardHeight * m.browseScale <=
        viewport - 16,
    );
    assert.equal(g.readEnd, g.morphEnd + g.browseOverflow);
    assert.ok(g.pinEnd > g.readEnd);
    const readingTop = desktop ? g.browsePosition : nav + 16;
    const carouselStops = g.stops.filter(
      (stop) => stop >= g.morphEnd && stop <= g.readEnd,
    );
    assert.ok(
      carouselStops.every(
        (stop, i) =>
          i === 0 ||
          stop - carouselStops[i - 1] <=
            Math.max(1, viewport - readingTop - 16) + 0.01,
      ),
    );
  }
});
test('content records have unique stable IDs and paired translations', () => {
  for (const records of [projects, experiences, education, abilities])
    assert.equal(new Set(records.map((r) => r.id)).size, records.length);
  const check = (value: unknown) => {
    if (!value || typeof value !== 'object') return;
    const item = value as Record<string, unknown>;
    if ('zh' in item || 'en' in item) {
      assert.equal(typeof item.zh, 'string');
      assert.equal(typeof item.en, 'string');
    }
    Object.values(item).forEach(check);
  };
  [projects, experiences, education, abilities].forEach(check);
});
