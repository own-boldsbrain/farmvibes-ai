import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CarbonIntensityDisplay } from './CarbonIntensityDisplay';
import {
  mockCarbonIntensityDisplayDefault,
  mockCarbonIntensityDisplayWithSquare,
  mockCarbonIntensityDisplayUndefined,
} from './CarbonIntensityDisplay.mock';

vi.mock('hooks/theme', () => ({
  useCo2ColorScale: () => (intensity: number) => `rgb(${intensity}, 0, 0)`,
}));

describe('<CarbonIntensityDisplay />', () => {
  it('renders standard CO2 intensity text correctly', () => {
    render(<CarbonIntensityDisplay {...mockCarbonIntensityDisplayDefault} />);
    expect(screen.getByText('250')).toBeInTheDocument();
    expect(screen.getByText(/gCO₂eq\/kWh/)).toBeInTheDocument();
  });

  it('renders custom square color indicator if withSquare is true', () => {
    const { container } = render(<CarbonIntensityDisplay {...mockCarbonIntensityDisplayWithSquare} />);
    const square = container.querySelector('.h-2.w-2');
    expect(square).toBeInTheDocument();
    expect(square?.getAttribute('style')).toContain('background-color: rgb(480, 0, 0)');
  });

  it('renders fallback question mark when intensity is undefined', () => {
    render(<CarbonIntensityDisplay {...mockCarbonIntensityDisplayUndefined} />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });
});
