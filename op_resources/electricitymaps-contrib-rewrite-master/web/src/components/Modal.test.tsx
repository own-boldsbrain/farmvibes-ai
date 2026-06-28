import '../testing/polyfillGlobals';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';
import { mockModalProps } from './Modal.mock';

describe('<Modal />', () => {
  it('renders modal content correctly when open', () => {
    const handleClose = vi.fn();
    render(<Modal {...mockModalProps} setIsOpen={handleClose} />);
    expect(screen.getByText(mockModalProps.title)).toBeInTheDocument();
    expect(screen.getByText('Modal Body Content')).toBeInTheDocument();
  });

  it('triggers setIsOpen callback when close button is clicked', () => {
    const handleClose = vi.fn();
    render(<Modal {...mockModalProps} setIsOpen={handleClose} />);
    const closeBtn = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledWith(false);
  });
});
