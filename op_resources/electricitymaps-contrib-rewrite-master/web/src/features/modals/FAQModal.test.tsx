import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { mockFAQModalProps } from './FAQModal.mock';
import FAQModal from './FAQModal';

// Common mocks to prevent React context and Jotai state initialization issues
vi.mock('jotai', () => ({
  useAtom: () => [{ datetimeString: new Date().toISOString() }, vi.fn()],
  atom: () => ({}),
  useSetAtom: () => vi.fn(),
}));

vi.mock('translation/translation', () => ({
  useTranslation: () => ({
    __: (key: string) => key,
    i18n: { language: 'pt-BR', exists: () => true },
  }),
  getZoneName: (zoneId: string) => `Zone-${zoneId}`,
  getCountryName: (zoneId: string) => `Country-${zoneId}`,
  getShortenedZoneNameWithCountry: (zoneId: string) => `Short-${zoneId}`,
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ search: '', hash: '' }),
  useParams: () => ({ zoneId: 'BR' }),
  useSearchParams: () => [{ get: () => null }],
  resolvePath: (path: string) => path,
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  NavLink: ({ children, to }: any) => <a href={to}>{children}</a>,
}));


vi.mock('@radix-ui/react-dialog', () => {
  return {
    Root: ({ children, open }: any) => open ? React.createElement('div', null, children) : null,
    Portal: ({ children }: any) => React.createElement('div', null, children),
    Overlay: () => React.createElement('div', null),
    Content: ({ children }: any) => React.createElement('div', null, children),
    Title: ({ children }: any) => React.createElement('h3', null, children),
    Close: ({ children }: any) => React.createElement('button', null, children),
  };
});

describe('<FAQModal {...mockFAQModalProps} />', () => {
  it('renders correctly', () => {
    const { container } = render(<FAQModal {...mockFAQModalProps} />);
    expect(container).toBeDefined();
  });
});
