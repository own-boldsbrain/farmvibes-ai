import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { MapContext } from 'react-map-gl/dist/esm/components/map';
import '../src/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const mockMap = {
  addControl: () => {},
  removeControl: () => {},
  getMap: () => mockMap,
  on: () => {},
  off: () => {},
  project: () => ({ x: 0, y: 0 }),
  unproject: () => ({ lng: 0, lat: 0 }),
  getCenter: () => ({ lng: 0, lat: 0 }),
  getZoom: () => 1,
  getBearing: () => 0,
  getPitch: () => 0,
};

const mockMapContext = {
  mapLib: {},
  map: mockMap,
};

export const decorators = [
  (Story) => (
    <QueryClientProvider client={queryClient}>
      <MapContext.Provider value={mockMapContext}>
        <MemoryRouter initialEntries={['/']}>
          <Story />
        </MemoryRouter>
      </MapContext.Provider>
    </QueryClientProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
