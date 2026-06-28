import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { mockConsumptionProductionToggleProps } from './ConsumptionProductionToggle.mock';
import ConsumptionProductionToggle from './ConsumptionProductionToggle';

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

describe('<ConsumptionProductionToggle {...mockConsumptionProductionToggleProps} />', () => {
  it('renders correctly', () => {
    const { container } = render(<ConsumptionProductionToggle {...mockConsumptionProductionToggleProps} />);
    expect(container).toBeDefined();
  });
});
