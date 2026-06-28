import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CarbonIntensitySquare from './CarbonIntensitySquare';
import { mockCarbonIntensitySquareLow, mockCarbonIntensitySquareHigh } from './CarbonIntensitySquare.mock';

vi.mock('../hooks/theme', () => ({
  useCo2ColorScale: () => (intensity: number) => {
    // Return green for low, red for high
    return intensity < 100 ? 'rgb(0, 255, 0)' : 'rgb(255, 0, 0)';
  },
}));

vi.mock('translation/translation', () => ({
  useTranslation: () => ({
    __: (key: string) => key,
  }),
}));

describe('<CarbonIntensitySquare />', () => {
  it('renders correctly with low intensity and default subtext option', () => {
    render(<CarbonIntensitySquare {...mockCarbonIntensitySquareLow} />);
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('country-panel.carbonintensity')).toBeInTheDocument();
    expect(screen.queryByText('(gCO₂eq/kWh)')).toBeNull();
  });

  it('renders correctly with high intensity and displays subtext units', () => {
    render(<CarbonIntensitySquare {...mockCarbonIntensitySquareHigh} />);
    expect(screen.getByText('650')).toBeInTheDocument();
    expect(screen.getByText('(gCO₂eq/kWh)')).toBeInTheDocument();
  });
});
