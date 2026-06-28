import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TimeSlider from './TimeSlider';
import { mockTimeSliderDefault } from './TimeSlider.mock';

describe('<TimeSlider />', () => {
  it('renders slider element correctly', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <TimeSlider
        {...mockTimeSliderDefault}
        onChange={handleChange}
      />
    );
    const sliderRoot = container.querySelector('[span]');
    // Radix UI Slider renders elements representing the thumb, track, and range.
    // We just verify it successfully mounts.
    expect(container.firstChild).toBeInTheDocument();
  });
});
