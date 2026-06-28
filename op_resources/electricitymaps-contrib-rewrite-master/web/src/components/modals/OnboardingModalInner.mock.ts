import React from 'react';

export const mockOnboardingModalInnerProps = {
  modalName: 'test-onboarding',
  views: [
    {
      headerImage: { pathname: '/images/test1.png' },
      isMainTitle: true,
      renderContent: (__: (key: string) => string) => React.createElement('p', null, __('step1')),
    },
    {
      headerImage: { pathname: '/images/test2.png' },
      renderContent: (__: (key: string) => string) => React.createElement('p', null, __('step2')),
    },
  ],
  visible: true,
};
