export const mockGraphHoverlineProps = {
  timeScale: Object.assign((v: any) => 0, { range: () => [0, 100], domain: () => [0, 100] }),
  valueScale: Object.assign((v: any) => 0, { range: () => [0, 100], domain: () => [0, 100] }),
  hoveredDatapointIndex: 0,
  datetimes: [new Date()],
};
