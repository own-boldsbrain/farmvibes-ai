import React from 'react';

export const mockCircularGaugeHalf = {
  ratio: 0.5,
  name: 'Hydropower',
  tooltipContent: 'Hydropower is 50% of the grid mix.',
  testId: 'hydro-gauge',
};

export const mockCircularGaugeFull = {
  ratio: 1.0,
  name: 'Solar',
  tooltipContent: React.createElement('div', null, 'Solar is 100%'),
  testId: 'solar-gauge',
};
