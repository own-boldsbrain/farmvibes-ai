import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';
import {
  mockButtonDefaultProps,
  mockButtonWithIconProps,
  mockButtonLinkProps,
  mockButtonDisabledProps,
} from './Button.mock';

describe('<Button />', () => {
  it('renders default button correctly', () => {
    render(<Button {...mockButtonDefaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(mockButtonDefaultProps.children);
  });

  it('renders as a link when href is passed', () => {
    render(<Button {...mockButtonLinkProps} />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toBe(mockButtonLinkProps.href);
  });

  it('renders icon if provided', () => {
    render(<Button {...mockButtonWithIconProps} />);
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button {...mockButtonDefaultProps} onClick={handleClick} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('cannot be clicked when disabled', () => {
    const handleClick = vi.fn();
    render(<Button {...mockButtonDisabledProps} onClick={handleClick} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
