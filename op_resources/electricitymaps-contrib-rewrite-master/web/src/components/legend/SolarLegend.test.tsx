import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SolarLegend from './SolarLegend';

vi.mock('translation/translation', () => ({
  useTranslation: () => ({
    __: (key: string) => `Trans-${key}`,
  }),
}));

vi.mock('../../features/weather-layers/solar/utils', () => {
  const mockScale = () => '#ffffff';
  mockScale.domain = () => [0, 1000];
  return {
    solarColor: mockScale,
  };
});

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
