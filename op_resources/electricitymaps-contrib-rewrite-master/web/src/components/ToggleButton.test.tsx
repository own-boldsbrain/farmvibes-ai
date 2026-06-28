import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ToggleButton from './ToggleButton';
import { mockToggleButtonSimple } from './ToggleButton.mock';

vi.mock('../translation/translation', () => ({
  useTranslation: () => ({
    __: (key: string) => `Trans-${key}`,
  }),
}));

describe('<ToggleButton />', () => {
  it('renders all options and active state correctly', () => {
    const handleToggle = vi.fn();
    render(<ToggleButton {...mockToggleButtonSimple} onToggle={handleToggle} />);
    expect(screen.getByText('Trans-Hourly')).toBeInTheDocument();
    expect(screen.getByText('Trans-Daily')).toBeInTheDocument();
  });

  it('triggers onToggle callback when option is clicked', () => {
    const handleToggle = vi.fn();
    render(<ToggleButton {...mockToggleButtonSimple} onToggle={handleToggle} />);
    const dailyItem = screen.getByText('Trans-Daily');
    fireEvent.click(dailyItem);
    expect(handleToggle).toHaveBeenCalledWith('daily');
  });
});
