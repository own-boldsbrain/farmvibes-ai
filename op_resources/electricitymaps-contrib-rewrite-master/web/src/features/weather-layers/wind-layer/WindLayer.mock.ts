import type { MapboxMap } from 'react-map-gl';

export const mockWindLayerProps = {
  map: {
    getZoom: () => 5,
    on: () => {},
    off: () => {},
    unproject: () => ({ lng: 0, lat: 0 }),
    project: () => ({ x: 0, y: 0 }),
  } as any,
};
