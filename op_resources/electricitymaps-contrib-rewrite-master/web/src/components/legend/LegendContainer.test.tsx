import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import LegendContainer from './LegendContainer';
import { mockLegendContainerState, mockLegendContainerStateOff } from './LegendContainer.mock';

let mockSolarToggle = 'off';
let mockWindToggle = 'off';
let mockDatetime = { index: 0 };

vi.mock('jotai', () => ({
  useAtom: (atom: any) => {
    if (atom === 'solarLayerEnabledAtom') return [mockSolarToggle];
    if (atom === 'windLayerAtom') return [mockWindToggle];
    return [mockDatetime];
  },
}));

vi.mock('utils/state/atoms', () => ({
  solarLayerEnabledAtom: 'solarLayerEnabledAtom',
  windLayerAtom: 'windLayerAtom',
  selectedDatetimeIndexAtom: 'selectedDatetimeIndexAtom',
}));

vi.mock('utils/constants', () => ({
  ToggleOptions: { ON: 'on', OFF: 'off' },
}));

// Mock the sub-legends
vi.mock('./Co2Legend', () => ({
  default: () => <div data-testid="co2-legend-mock" />,
}));
vi.mock('./SolarLegend', () => ({
  default: () => <div data-testid="solar-legend-mock" />,
}));
vi.mock('./WindLegend', () => ({
  default: () => <div data-testid="wind-legend-mock" />,
}));

describe('<LegendContainer />', () => {
  beforeEach(() => {
    mockSolarToggle = 'off';
    mockWindToggle = 'off';
    mockDatetime = { index: 0 };
  });

  it('renders default Co2Legend and hides weather legends when layers are disabled', () => {
    mockSolarToggle = mockLegendContainerStateOff.solarLayerToggle;
    mockWindToggle = mockLegendContainerStateOff.windLayerToggle;
    mockDatetime = mockLegendContainerStateOff.selectedDatetime;

    render(<LegendContainer />);
    expect(screen.getByTestId('co2-legend-mock')).toBeInTheDocument();
    expect(screen.queryByTestId('solar-legend-mock')).toBeNull();
    expect(screen.queryByTestId('wind-legend-mock')).toBeNull();
  });

  it('renders weather legends when corresponding layers are enabled at index 24', () => {
    mockSolarToggle = mockLegendContainerState.solarLayerToggle;
    mockWindToggle = mockLegendContainerState.windLayerToggle;
    mockDatetime = mockLegendContainerState.selectedDatetime;

    render(<LegendContainer />);
    expect(screen.getByTestId('co2-legend-mock')).toBeInTheDocument();
    expect(screen.getByTestId('solar-legend-mock')).toBeInTheDocument();
    expect(screen.getByTestId('wind-legend-mock')).toBeInTheDocument();
  });
});
