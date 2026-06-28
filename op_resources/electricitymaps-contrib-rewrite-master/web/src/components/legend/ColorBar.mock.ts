import { scaleLinear } from 'd3-scale';

export const mockColorBarProps = {
  colorScale: scaleLinear<string, string>().domain([0, 1000]).range(['#00ff00', '#ff0000']),
  id: 'test-co2',
  ticksCount: 5,
};
