import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Toast from './Toast';
import { mockToastDefault, mockToastWithAction } from './Toast.mock';

vi.mock('@radix-ui/react-toast', () => {
  return {
    Provider: ({ children }: any) => <div data-testid="toast-provider">{children}</div>,
    Root: ({ children, open, onOpenChange }: any) =>
      open ? <div data-testid="mock-toast-root">{children}</div> : null,
    Title: ({ children }: any) => <h4>{children}</h4>,
    Description: ({ children }: any) => <p>{children}</p>,
    Action: ({ children, onClick }: any) => (
      <button onClick={() => onClick && onClick()}>{children}</button>
    ),
    Close: ({ children }: any) => <button>{children}</button>,
    Viewport: () => <div data-testid="mock-toast-viewport" />,
  };
});

describe('<Toast />', () => {
  it('renders title and description details correctly', () => {
    render(<Toast {...mockToastDefault} />);
    expect(screen.getByText(mockToastDefault.title)).toBeInTheDocument();
    expect(screen.getByText(mockToastDefault.description)).toBeInTheDocument();
  });

  it('triggers action callback when action button is clicked', () => {
    const handleAction = vi.fn();
    render(<Toast {...mockToastWithAction} toastAction={handleAction} />);
    const actionBtn = screen.getByRole('button', { name: /Retry Connection/ });
    fireEvent.click(actionBtn);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});
