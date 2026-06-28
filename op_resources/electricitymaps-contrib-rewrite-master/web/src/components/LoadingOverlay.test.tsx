import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import LoadingOverlay from './LoadingOverlay';
import { mockLoadingOverlayState, mockLoadingOverlayHiddenState } from './LoadingOverlay.mock';

// Local mock values we can dynamically alter during tests
let mockIsLoading = true;
let mockIsError = false;
let mockIsLoadingMap = false;

vi.mock('api/getState', () => ({
  default: () => ({
    isLoading: mockIsLoading,
    isError: mockIsError,
  }),
}));

vi.mock('jotai', () => ({
  useAtom: () => [mockIsLoadingMap],
}));

vi.mock('features/map/mapAtoms', () => ({
  loadingMapAtom: 'loadingMapAtom',
}));

describe('<LoadingOverlay />', () => {
  beforeEach(() => {
    mockIsLoading = true;
    mockIsError = false;
    mockIsLoadingMap = false;
  });

  it('renders visible backdrop overlay when loading state is true', () => {
    mockIsLoading = mockLoadingOverlayState.isLoading;
    mockIsError = mockLoadingOverlayState.isError;
    mockIsLoadingMap = mockLoadingOverlayState.isLoadingMap;

    const { container } = render(<LoadingOverlay />);
    // Should render the animated div loadingIcon background overlay
    expect(container.firstChild).toBeInTheDocument();
  });

  it('does not render overlay backdrop when loading states are false', () => {
    mockIsLoading = mockLoadingOverlayHiddenState.isLoading;
    mockIsError = mockLoadingOverlayHiddenState.isError;
    mockIsLoadingMap = mockLoadingOverlayHiddenState.isLoadingMap;

    const { container } = render(<LoadingOverlay />);
    expect(container.firstChild).toBeNull();
  });
});
