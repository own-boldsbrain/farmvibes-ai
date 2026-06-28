import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import HorizontalColorbar from './ColorBar';
import { mockColorBarProps } from './ColorBar.mock';

describe('<HorizontalColorbar />', () => {
  it('renders SVG colorbar and correct number of ticks', () => {
    const { container } = render(<HorizontalColorbar {...mockColorBarProps} />);
    const ticks = container.querySelectorAll('.tick');
    expect(ticks.length).toBe(mockColorBarProps.ticksCount);

    // Verify stops in linear gradient
    const stops = container.querySelectorAll('stop');
    expect(stops.length).toBeGreaterThan(0);
  });
});
