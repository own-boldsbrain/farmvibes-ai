import React from 'react';

export const mockButtonDefaultProps = {
  children: 'Default Button text',
};

export const mockButtonWithIconProps = {
  children: 'Button with Icon',
  icon: React.createElement('span', { 'data-testid': 'mock-icon' }, '🔍'),
};

export const mockButtonLinkProps = {
  children: 'Link Button',
  href: 'https://example.com',
};

export const mockButtonDisabledProps = {
  children: 'Disabled Button',
  disabled: true,
};
