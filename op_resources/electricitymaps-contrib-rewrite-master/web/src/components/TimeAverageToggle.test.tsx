import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TimeAverageToggle from './TimeAverageToggle';
import { TimeAverages, mockTimeAverageToggleHourly } from './TimeAverageToggle.mock';

vi.mock('translation/translation', () => ({
  useTranslation: () => ({
    i18n: { language: 'pt-BR' },
  }),
}));

vi.mock('utils/constants', () => ({
  TimeAverages: {
    HOURLY: 'hourly',
    DAILY: 'daily',
    MONTHLY: 'monthly',
    YEARLY: 'yearly',
  },
}));

vi.mock('utils/formatting', () => ({
  formatTimeRange: (lang: string, value: string) => {
    return `Label-${value}`;
  },
}));

describe('<TimeAverageToggle />', () => {
  it('renders all four time average options correctly', () => {
    const handleToggle = vi.fn();
    render(
      <TimeAverageToggle
        timeAverage={TimeAverages.HOURLY}
        onToggleGroupClick={handleToggle}
      />
    );
    expect(screen.getByText('Label-hourly')).toBeInTheDocument();
    expect(screen.getByText('Label-daily')).toBeInTheDocument();
    expect(screen.getByText('Label-monthly')).toBeInTheDocument();
    expect(screen.getByText('Label-yearly')).toBeInTheDocument();
  });

  it('triggers click handler when item is clicked', () => {
    const handleToggle = vi.fn();
    render(
      <TimeAverageToggle
        timeAverage={TimeAverages.HOURLY}
        onToggleGroupClick={handleToggle}
      />
    );
    const dailyItem = screen.getByText('Label-daily');
    fireEvent.click(dailyItem);
    expect(handleToggle).toHaveBeenCalledWith(TimeAverages.DAILY);
  });
});
