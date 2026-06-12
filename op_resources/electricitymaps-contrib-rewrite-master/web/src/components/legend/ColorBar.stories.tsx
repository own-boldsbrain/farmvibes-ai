import type { Meta, StoryObj } from'@storybook/react';
import { scaleLinear } from'd3-scale';
import HorizontalColorbar from'./ColorBar';

const meta: Meta<typeof HorizontalColorbar> = {
 title:'Basics/Legends/ColorBar',
 component: HorizontalColorbar,
};

export default meta;
type Story = StoryObj<typeof HorizontalColorbar>;

const mockScale = scaleLinear<string>()
 .domain([0, 500, 1000])
 .range(['#44ab60','#ffce00','#e35a3e']);

export const Default: Story = {
 args: {
 colorScale: mockScale as any,
 id:'test-colorbar',
 ticksCount: 5,
 },
};
