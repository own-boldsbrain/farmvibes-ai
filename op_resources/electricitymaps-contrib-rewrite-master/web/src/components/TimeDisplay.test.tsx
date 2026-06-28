import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TimeDisplay } from './TimeDisplay';
import { mockTimeDisplayProps, mockTimeDisplayState } from './TimeDisplay.mock';

// Mock translation & date formatting
vi.mock('translation/translation', () => ({
  useTranslation: () => ({
    i18n: { language: 'pt-BR' },
  }),
}));

vi.mock('utils/formatting', () => ({
  formatDate: (date: Date, lang: string, average: string) => {
    return `Formatted: ${date.toISOString()} [${lang}] [${average}]`;
  },
}));

// Mock Jotai atom values
vi.mock('jotai', () => ({
  useAtom: (atom: any) => {
    // Determine which atom is being used based on a name or key mock
    if (atom === 'timeAverageAtom') {
      return [mockTimeDisplayState.timeAverage];
    }
    return [mockTimeDisplayState.selectedDatetime];
  },
}));

vi.mock('utils/state/atoms', () => ({
  timeAverageAtom: 'timeAverageAtom',
  selectedDatetimeIndexAtom: 'selectedDatetimeIndexAtom',
}));

describe('<TimeDisplay />', () => {
  it('renders time string correctly by format helper', () => {
    render(<TimeDisplay {...mockTimeDisplayProps} />);
    const p = screen.getByText(/Formatted:/);
    expect(p).toBeInTheDocument();
    expect(p.className).toContain('text-zinc-500');
    expect(p).toHaveTextContent('Formatted: 2026-06-28T12:00:00.000Z [pt-BR] [hourly]');
  });
});
