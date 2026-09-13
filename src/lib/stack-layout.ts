export interface StackMeasurements {
  viewport: number;
  nav: number;
  desktop: boolean;
  headingTop: number;
  headingHeight: number;
  headingGap: number;
  cardHeight: number;
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
  const browsePosition = groupTop + m.headingHeight + m.headingGap;
  const stackPosition = m.desktop
    ? browsePosition
    : Math.max(m.nav + 16, m.stackPosition);
  const triggers = m.cardTops.map(
    (top, i) => top - stackPosition - m.stackDistance * i,
  );
  const last = m.cardTops.at(-1);
  const morphStart =
    last === undefined ? 0 : Math.max(last - m.scaleEnd, last - stackPosition);
  const morphEnd = morphStart + m.viewport * 0.45;
  const pinEnd = morphEnd + m.viewport * 0.5;
  const headingStop = m.headingTop - m.nav;
  return {
    groupTop,
    browsePosition,
    stackPosition,
    triggers,
    morphStart,
    morphEnd,
    pinEnd,
    stops:
      last === undefined
        ? [headingStop]
        : [
            headingStop,
            ...triggers.filter((p) => p > headingStop + 30),
            morphEnd,
            pinEnd,
          ],
  };
}
export function progressBetween(value: number, start: number, end: number) {
  return end <= start
    ? Number(value >= end)
    : Math.max(0, Math.min(1, (value - start) / (end - start)));
}
