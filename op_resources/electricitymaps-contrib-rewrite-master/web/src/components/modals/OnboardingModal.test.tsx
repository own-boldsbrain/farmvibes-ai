import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { OnboardingModal } from './OnboardingModal';
import { mockOnboardingModalStateVisible, mockOnboardingModalStateHidden } from './OnboardingModal.mock';

let mockHasSeen = false;
let mockSkip = 'false';

vi.mock('jotai', () => ({
  useAtom: () => [mockHasSeen, vi.fn()],
}));

vi.mock('utils/state/atoms', () => ({
  hasOnboardingBeenSeenAtom: 'hasOnboardingBeenSeenAtom',
}));

vi.mock('react-router-dom', () => ({
  useSearchParams: () => [
    {
      get: (key: string) => (key === 'skip-onboarding' ? mockSkip : null),
    },
  ],
  resolvePath: (path: string) => `/resolved/${path}`,
  MemoryRouter: ({ children }: any) => <>{children}</>,
}));

// Mock the inner modal layout to verify visibility triggers
vi.mock('./OnboardingModalInner', () => ({
  default: ({ visible }: any) => (
    visible ? <div data-testid="onboarding-modal-inner">Onboarding Content</div> : null
  ),
}));

describe('<OnboardingModal />', () => {
  beforeEach(() => {
    mockHasSeen = false;
    mockSkip = 'false';
  });

  it('renders modal when onboarding has not been seen', () => {
    mockHasSeen = mockOnboardingModalStateVisible.hasOnboardingBeenSeen;
    render(
      <MemoryRouter>
        <OnboardingModal />
      </MemoryRouter>
    );
    expect(screen.getByTestId('onboarding-modal-inner')).toBeInTheDocument();
  });

  it('does not render modal when onboarding has been seen', () => {
    mockHasSeen = mockOnboardingModalStateHidden.hasOnboardingBeenSeen;
    const { container } = render(
      <MemoryRouter>
        <OnboardingModal />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });
});
