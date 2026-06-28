import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from './Badge';
import { mockBadgeDefaultProps, mockBadgeWarningProps, mockBadgeCustomProps } from './Badge.mock';

describe('<Badge />', () => {
  it('renders default badge correctly', () => {
    render(<Badge {...mockBadgeDefaultProps} />);
    const element = screen.getByText(mockBadgeDefaultProps.children);
    expect(element).toBeInTheDocument();
    expect(element.className).toContain('bg-gray-300');
  });

  it('renders warning badge correctly', () => {
    render(<Badge {...mockBadgeWarningProps} />);
    const element = screen.getByText(mockBadgeWarningProps.children);
    expect(element).toBeInTheDocument();
    expect(element.className).toContain('bg-yellow-400');
  });

  it('applies custom className', () => {
    render(<Badge {...mockBadgeCustomProps} />);
    const element = screen.getByText(mockBadgeCustomProps.children);
    expect(element.className).toContain('custom-class');
  });
});
