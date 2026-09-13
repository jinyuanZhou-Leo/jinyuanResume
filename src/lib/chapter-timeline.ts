export interface ReadingBeat {
  start: number;
  enter: number;
  read: number;
  leave: number;
  end: number;
}
const beat = (start: number, end: number): ReadingBeat => ({
  start,
  enter: start + (end - start) * 0.3,
  read: start + (end - start) * 0.65,
  leave: start + (end - start) * 0.82,
  end,
});

/** Fixed time per record, normalized only after the complete narrative is known. */
export function buildAboutTimeline(
  schoolCount: number,
  abilityCount: number,
  hasToolkit = true,
) {
  const total =
    0.08 + schoolCount * 0.165 + (hasToolkit ? 0.17 : 0) + abilityCount * 0.084;
  let cursor = 0.08;
  const take = (weight: number) => {
    const start = cursor;
    cursor += weight;
    return beat(start / total, cursor / total);
  };
  const schools = Array.from({ length: schoolCount }, () => take(0.165));
  const toolkit = hasToolkit ? take(0.17) : undefined;
  const abilities = Array.from({ length: abilityCount }, () => take(0.084));
  return {
    schools,
    toolkit,
    abilities,
    introEnd: schools.at(-1)?.end ?? 0.08 / total,
    scrollVh: total * 850,
    stops: [
      0.04 / total,
      ...schools.map((b) => b.read),
      ...(toolkit ? [toolkit.read] : []),
      ...abilities.map((b) => b.read),
    ],
  };
}

export function buildExperienceTimeline(lineCounts: readonly number[]) {
  const entryWeights = lineCounts.map((count) => 0.7 + count * 0.055);
  const total = 0.22 + entryWeights.reduce((sum, n) => sum + n, 0) + 0.22;
  let cursor = 0.22;
  const entries = entryWeights.map((weight, index) => {
    const start = cursor / total;
    cursor += weight;
    const end = cursor / total;
    const count = lineCounts[index];
    const lines = Array.from({ length: count }, (_, i) => ({
      start: start + (((i / Math.max(1, count)) * weight) / total) * 0.5,
      end:
        start +
        ((((i + 1) / Math.max(1, count)) * weight) / total) * 0.5 +
        (0.06 * weight) / total,
    }));
    return { ...beat(start, end), lines, read: lines.at(-1)?.end ?? start };
  });
  return {
    entries,
    releaseStart: cursor / total,
    scrollVh: total * 160,
    stops: entries.flatMap((b) => [b.read, b.leave]),
  };
}

/** Balanced rows expand with the skill list while preserving the central title gap. */
export function skillLayout(count: number) {
  const topCount = Math.ceil(count / 2),
    bottomCount = count - topCount;
  const topRows = Math.ceil(topCount / 5),
    bottomRows = Math.ceil(bottomCount / 5);
  const height = Math.max(440, (topRows + bottomRows) * 96 + 120);
  const positions = Array.from({ length: count }, (_, i) => {
    const top = i < topCount;
    const index = top ? i : i - topCount;
    const groupCount = top ? topCount : bottomCount;
    const row = Math.floor(index / 5);
    const columns = Math.min(5, groupCount - row * 5);
    const y = top
      ? height / 2 - 80 - (topRows - row - 1) * 96
      : height / 2 + 88 + row * 96;
    return { x: (((index % 5) + 0.5) / columns) * 100, y: (y / height) * 100 };
  });
  return { height, positions };
}
