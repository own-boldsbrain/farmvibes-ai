import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Co2Legend from './Co2Legend';

vi.mock('hooks/theme', () => ({
  useCo2ColorScale: () => (intensity: number) => `rgb(${intensity}, 0, 0)`,
}));

vi.mock('translation/translation', () => ({
  useTranslation: () => ({
    __: (key: string) => `Trans-${key}`,
  }),
}));

// Mock ColorBar component to avoid rendering inline SVGs/div layouts in this test
vi.mock('./ColorBar', () => ({
  default: () => <div data-testid="color-bar-mock" />,
}));

describe('<Co2Legend />', () => {
  it('renders label and ColorBar component correctly', () => {
    render(<Co2Legend />);
    expect(screen.getByText(/Trans-legends.carbonintensity/)).toBeInTheDocument();
    expect(screen.getByText('(gCO₂eq/kWh)')).toBeInTheDocument();
    expect(screen.getByTestId('color-bar-mock')).toBeInTheDocument();
  });
});
