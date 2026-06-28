export const mockTimeAxisProps = {
  timeScale: Object.assign((v: any) => 0, { range: () => [0, 100], domain: () => [0, 100] }),
  datetimes: [new Date()],
};
