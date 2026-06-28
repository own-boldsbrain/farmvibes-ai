export const mockExchangeLayerProps = {
  map: {
    getZoom: () => 5,
    project: () => ({ x: 100, y: 100 }),
    on: () => {},
    off: () => {},
  } as any,
};
