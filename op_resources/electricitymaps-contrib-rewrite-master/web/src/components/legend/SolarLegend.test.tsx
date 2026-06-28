import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SolarLegend from './SolarLegend';
import { scaleLinear } from 'd3-scale';

vi.mock('translation/translation', () => ({
  useTranslation: () => ({
    __: (key: string) => `Trans-${key}`,
  }),
}));

vi.mock('../../features/weather-layers/solar/utils', () => ({
  solarColor: scaleLinear<string, string>().domain([0, 1000]).range(['#000', '#fff']),
}));

// Mock ColorBar component to avoid rendering inline SVGs/div layouts in this test
vi.mock('./ColorBar', () => ({
  default: () => <div data-testid="color-bar-mock" />,
}));

describe('<SolarLegend />', () => {
  it('renders label and ColorBar component correctly', () => {
    render(<SolarLegend />);
    expect(screen.getByText(/Trans-legends.solarpotential/)).toBeInTheDocument();
    expect(screen.getByText('(W/m²)')).toBeInTheDocument();
    expect(screen.getByTestId('color-bar-mock')).toBeInTheDocument();
  });
});
