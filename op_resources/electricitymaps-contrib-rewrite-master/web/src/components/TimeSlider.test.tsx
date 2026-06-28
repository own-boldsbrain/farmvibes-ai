import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TimeSlider from './TimeSlider';
import { mockTimeSliderDefault } from './TimeSlider.mock';

vi.mock('@radix-ui/react-slider', () => {
  return {
    Root: ({ children, onValueChange, max, value }: any) => (
      <div 
        data-testid="mock-slider-root"
        onClick={() => onValueChange && onValueChange([Math.min(value[0] + 1, max)])}
      >
        {children}
      </div>
    ),
    Track: ({ children }: any) => <div data-testid="mock-slider-track">{children}</div>,
    Range: () => <div data-testid="mock-slider-range" />,
    Thumb: () => <div data-testid="mock-slider-thumb" />,
  };
});

describe('<TimeSlider />', () => {
  it('renders slider element correctly and responds to change events', () => {
    const handleChange = vi.fn();
    render(<TimeSlider {...mockTimeSliderDefault} onChange={handleChange} />);
    
    expect(screen.getByTestId('mock-slider-root')).toBeInTheDocument();
    expect(screen.getByTestId('mock-slider-track')).toBeInTheDocument();
    expect(screen.getByTestId('mock-slider-range')).toBeInTheDocument();
    expect(screen.getByTestId('mock-slider-thumb')).toBeInTheDocument();

    // Trigger change via our root mock click trigger
    fireEvent.click(screen.getByTestId('mock-slider-root'));
    expect(handleChange).toHaveBeenCalledWith(6); // selectedIndex 5 + 1
  });
});
