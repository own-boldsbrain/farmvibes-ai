import '../testing/polyfillGlobals';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';
import { mockModalProps } from './Modal.mock';

let activeOnOpenChange: any = null;

vi.mock('@radix-ui/react-dialog', () => {
  return {
    Root: ({ children, open, onOpenChange }: any) => {
      activeOnOpenChange = onOpenChange;
      return open ? <div data-testid="mock-dialog-root">{children}</div> : null;
    },
    Portal: ({ children }: any) => <div data-testid="mock-dialog-portal">{children}</div>,
    Overlay: () => <div data-testid="mock-dialog-overlay" />,
    Content: ({ children }: any) => <div data-testid="mock-dialog-content">{children}</div>,
    Title: ({ children }: any) => <h3>{children}</h3>,
    Close: ({ children, onClick }: any) => (
      <button
        onClick={() => {
          if (onClick) {onClick();}
          if (activeOnOpenChange) {activeOnOpenChange(false);}
        }}
        aria-label="Close"
      >
        {children}
      </button>
    ),
  };
});

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
    const closeButton = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledWith(false);
  });
});
