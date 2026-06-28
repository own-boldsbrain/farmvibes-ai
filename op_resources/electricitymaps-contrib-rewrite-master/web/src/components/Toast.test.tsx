import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastProvider } from '@radix-ui/react-toast';
import Toast from './Toast';
import { mockToastDefault, mockToastWithAction } from './Toast.mock';

describe('<Toast />', () => {
  it('renders title and description details correctly', () => {
    render(
      <ToastProvider>
        <Toast {...mockToastDefault} />
      </ToastProvider>
    );
    expect(screen.getByText(mockToastDefault.title)).toBeInTheDocument();
    expect(screen.getByText(mockToastDefault.description)).toBeInTheDocument();
  });

  it('triggers action callback when action button is clicked', () => {
    const handleAction = vi.fn();
    render(
      <ToastProvider>
        <Toast {...mockToastWithAction} toastAction={handleAction} />
      </ToastProvider>
    );
    const actionBtn = screen.getByRole('button', { name: /Retry Connection/ });
    fireEvent.click(actionBtn);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});
