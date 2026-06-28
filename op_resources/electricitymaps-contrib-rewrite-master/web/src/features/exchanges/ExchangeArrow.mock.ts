export const mockExchangeArrowProps = {
  data: {
    key: 'US->BR',
    co2intensity: 200,
    lonlat: [0, 0],
    netFlow: 50,
    rotation: 45,
  },
  viewportWidth: 1000,
  viewportHeight: 1000,
  map: {
    getZoom: () => 5,
    project: () => ({ x: 100, y: 100 }),
  } as any,
};
