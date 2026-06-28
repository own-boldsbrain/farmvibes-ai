import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricRatio } from './MetricRatio';
import { mockMetricRatioValid, mockMetricRatioInvalid } from './MetricRatio.mock';

describe('<MetricRatio />', () => {
  it('renders valid values with formatting correctly', () => {
    render(<MetricRatio {...mockMetricRatioValid} />);
    expect(screen.getByText('(45% / 100%)')).toBeInTheDocument();
  });

  it('renders question mark fallbacks when values are not finite', () => {
    render(<MetricRatio {...mockMetricRatioInvalid} />);
    expect(screen.getByText('(? / ?)')).toBeInTheDocument();
  });
});
