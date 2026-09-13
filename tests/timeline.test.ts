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
