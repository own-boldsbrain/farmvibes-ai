import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './OnboardingModalInner';
import { mockOnboardingModalInnerProps } from './OnboardingModalInner.mock';

vi.mock('translation/translation', () => ({
  useTranslation: () => ({
    __: (key: string) => `Trans-${key}`,
  }),
}));

describe('<OnboardingModalInner />', () => {
  it('renders visible view steps correctly and handles paging', () => {
    const handleDismiss = vi.fn();
    const { container } = render(
      <Modal {...mockOnboardingModalInnerProps} onDismiss={handleDismiss} />
    );

    // Initial state: Step 1 active
    expect(screen.getByText('Trans-step1')).toBeInTheDocument();
    expect(screen.queryByText('Trans-step2')).toBeNull();

    // Find and click the next chevron button
    const nextButton = container.querySelector('button[class*="pl-1"]');
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton!);

    // Next state: Step 2 active
    expect(screen.getByText('Trans-step2')).toBeInTheDocument();

    // Verify Checkmark button renders on final page index and calls dismiss handler
    const finishButton = container.querySelector('button[class*="bg-brand-green"]');
    expect(finishButton).toBeInTheDocument();
    fireEvent.click(finishButton!);
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });
});
