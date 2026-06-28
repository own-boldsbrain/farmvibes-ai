export const mockGraphBackgroundProps = {
  timeScale: Object.assign((v: any) => 0, { range: () => [0, 100], domain: () => [0, 100] }),
  valueScale: Object.assign((v: any) => 0, { range: () => [0, 100], domain: () => [0, 100] }),
  datetimes: [new Date()],
  mouseMoveHandler: () => {},
  mouseOutHandler: () => {},
  isMobile: false,
  svgNode: null,
};
