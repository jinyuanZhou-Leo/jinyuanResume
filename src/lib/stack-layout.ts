export interface StackMeasurements {
  viewport: number;
  nav: number;
  desktop: boolean;
  headingTop: number;
  headingHeight: number;
  headingGap: number;
  cardHeight: number;
  browseScale: number;
  cardTops: readonly number[];
  stackPosition: number;
  scaleEnd: number;
  stackDistance: number;
}
export function buildStackLayout(m: StackMeasurements) {
  const groupTop =
    m.nav +
    Math.max(
      12,
      (m.viewport -
        m.nav -
        m.headingHeight -
        m.headingGap -
        m.cardHeight -
        (m.cardTops.length - 1) * m.stackDistance * 0.5) /
        2,
    );
  const browsePosition = m.desktop
    ? groupTop + m.headingHeight + m.headingGap
    : m.nav + 16;
  const preferredPosition = m.desktop
    ? browsePosition
    : Math.max(m.nav + 16, m.stackPosition);
  // Let a tall card's bottom enter the viewport before the next card covers it.
  const stackPosition = Math.min(
    preferredPosition,
    m.viewport - m.cardHeight - (m.cardTops.length - 1) * m.stackDistance - 16,
  );
  const triggers = m.cardTops.map(
    (top, i) => top - stackPosition - m.stackDistance * i,
  );
  const last = m.cardTops.at(-1);
  const morphStart =
    last === undefined ? 0 : Math.max(last - m.scaleEnd, last - stackPosition);
  const morphEnd = morphStart + m.viewport * 0.45;
  const browseOverflow = Math.max(
    0,
    browsePosition + m.cardHeight * m.browseScale - m.viewport + 16,
  );
  const readEnd = morphEnd + browseOverflow;
  const pinEnd = readEnd + m.viewport * 0.5;
  const headingStop = m.headingTop - m.nav;
  // Snapping must not jump over text on short screens or with enlarged fonts.
  const readingStops = (start: number, end: number) => {
    const readingTop = m.desktop ? browsePosition : m.nav + 16;
    const steps = Math.max(
      1,
      Math.ceil((end - start) / Math.max(1, m.viewport - readingTop - 16)),
    );
    return Array.from(
      { length: steps + 1 },
      (_, i) => start + ((end - start) * i) / steps,
    );
  };
  return {
    groupTop,
    browsePosition,
    stackPosition,
    triggers,
    morphStart,
    morphEnd,
    browseOverflow,
    readEnd,
    pinEnd,
    stops:
      last === undefined
        ? [headingStop]
        : [
            headingStop,
            ...m.cardTops
              .flatMap((top, i) =>
                readingStops(
                  Math.min(top - m.nav - 16, triggers[i]),
                  triggers[i],
                ),
              )
              .filter((p) => p > headingStop + 30),
            ...readingStops(morphEnd, readEnd),
            pinEnd,
          ],
  };
}
export function progressBetween(value: number, start: number, end: number) {
  return end <= start
    ? Number(value >= end)
    : Math.max(0, Math.min(1, (value - start) / (end - start)));
}
