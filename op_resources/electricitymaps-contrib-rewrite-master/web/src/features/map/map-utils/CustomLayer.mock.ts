import React from 'react';

export const mockCustomLayerProps = {
  children: React.createElement('div', null, 'Mock Layer Child'),
  map: {
    getZoom: () => 5,
    on: () => {},
    off: () => {},
  } as any,
};
