export const mockAreaGraphLayersProps = {
  layers: [],
  datetimes: [new Date()],
  timeScale: Object.assign((v: any) => 0, { range: () => [0, 100], domain: () => [0, 100] }),
  valueScale: Object.assign((v: any) => 0, { range: () => [0, 100], domain: () => [0, 100] }),
  mouseMoveHandler: () => {},
  mouseOutHandler: () => {},
  isMobile: false,
  svgNode: null,
};
