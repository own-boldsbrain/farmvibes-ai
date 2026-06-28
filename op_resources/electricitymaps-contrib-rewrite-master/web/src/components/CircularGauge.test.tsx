import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CircularGauge } from './CircularGauge';
import { mockCircularGaugeHalf, mockCircularGaugeFull } from './CircularGauge.mock';

// Mock TooltipWrapper to avoid Radix UI portal portal rendering details in tests
vi.mock('./tooltips/TooltipWrapper', () => ({
  default: ({ children }: any) => <div data-testid="tooltip-wrapper-mock">{children}</div>,
}));

// Mock recharts because it requires rendering elements that expect viewport dimensions
vi.mock('recharts', () => ({
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }: any) => <div data-testid="pie">{children}</div>,
  Label: ({ value }: any) => <div data-testid="label">{Math.round(value * 100)}%</div>,
}));

describe('<CircularGauge />', () => {
  it('renders correct percentage label and name', () => {
    render(<CircularGauge {...mockCircularGaugeHalf} />);
    expect(screen.getByTestId('tooltip-wrapper-mock')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('label')).toHaveTextContent('50%');
    expect(screen.getByText('Hydropower')).toBeInTheDocument();
  });

  it('renders correctly with full ratio', () => {
    render(<CircularGauge {...mockCircularGaugeFull} />);
    expect(screen.getByTestId('label')).toHaveTextContent('100%');
    expect(screen.getByText('Solar')).toBeInTheDocument();
  });
});
