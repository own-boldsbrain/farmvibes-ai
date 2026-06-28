import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { mockBreakdownChartTooltipProps } from './BreakdownChartTooltip.mock';
import BreakdownChartTooltip from './BreakdownChartTooltip';

// Common mocks to prevent React context and Jotai state initialization issues
vi.mock('jotai', () => ({
  useAtom: () => [{ datetimeString: new Date().toISOString() }, vi.fn()],
  atom: () => ({}),
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
  useParams: () => ({}),
  useSearchParams: () => [{ get: () => null }],
  resolvePath: (path: string) => path,
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  NavLink: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

describe('<BreakdownChartTooltip {...mockBreakdownChartTooltipProps} />', () => {
  it('renders correctly', () => {
    const { container } = render(<BreakdownChartTooltip {...mockBreakdownChartTooltipProps} />);
    expect(container).toBeDefined();
  });
});
