import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CarbonIntensityDisplay } from './CarbonIntensityDisplay';
import {
  mockCarbonIntensityDisplayDefault,
  mockCarbonIntensityDisplayWithSquare,
  mockCarbonIntensityDisplayUndefined,
} from './CarbonIntensityDisplay.mock';

vi.mock('hooks/theme', () => ({
  // Keep mock color scale consistent across tests to prevent worker threads cache conflicts
  useCo2ColorScale: () => (intensity: number) => `rgb(${intensity},0,0)`,
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
    const styleAttribute = square?.getAttribute('style') || '';
    // The color scale mock maps high values to rgb(255,0,0)
    expect(styleAttribute.replace(/\s+/g, '')).toContain('background-color:rgb(255,0,0)');
  });

  it('renders fallback question mark when intensity is undefined', () => {
    render(<CarbonIntensityDisplay {...mockCarbonIntensityDisplayUndefined} />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });
});
