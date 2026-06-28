import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import WindLegend from './WindLegend';
import { scaleLinear } from 'd3-scale';

vi.mock('translation/translation', () => ({
  useTranslation: () => ({
    __: (key: string) => `Trans-${key}`,
  }),
}));

vi.mock('features/weather-layers/wind-layer/scales', () => ({
  windColor: scaleLinear<string, string>().domain([0, 20]).range(['#000', '#fff']),
}));

// Mock ColorBar component to avoid rendering inline SVGs/div layouts in this test
vi.mock('./ColorBar', () => ({
  default: () => <div data-testid="color-bar-mock" />,
}));

describe('<WindLegend />', () => {
  it('renders label and ColorBar component correctly', () => {
    render(<WindLegend />);
    expect(screen.getByText(/Trans-legends.windpotential/)).toBeInTheDocument();
    expect(screen.getByText('(m/s)')).toBeInTheDocument();
    expect(screen.getByTestId('color-bar-mock')).toBeInTheDocument();
  });
});
