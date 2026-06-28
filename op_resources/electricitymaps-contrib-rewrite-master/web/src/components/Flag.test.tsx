import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CountryFlag } from './Flag';
import { mockFlagUSProps, mockFlagBRProps, mockFlagInvalidProps } from './Flag.mock';

describe('<CountryFlag />', () => {
  it('renders standard country flag icon correctly', () => {
    const { container } = render(<CountryFlag {...mockFlagUSProps} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders custom size country flag correctly', () => {
    const { container } = render(<CountryFlag {...mockFlagBRProps} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.getAttribute('width')).toBe(String(mockFlagBRProps.size));
  });

  it('renders fallback emoji for invalid country flag', () => {
    render(<CountryFlag {...mockFlagInvalidProps} />);
    expect(screen.getByText('🏴‍☠️')).toBeInTheDocument();
  });
});
