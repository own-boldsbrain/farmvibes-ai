import type { Meta, StoryObj } from'@storybook/react';
import { scaleLinear } from'd3-scale';
import Axis from'./Axis';

const meta: Meta<typeof Axis> = {
 title:'Features/Charts/BarBreakdown/Elements/Axis',
 component: Axis,
};

export default meta;
type Story = StoryObj<typeof Axis>;

const mockScale = scaleLinear().domain([0, 100]).range([0, 300]);

export const Default: Story = {
 render: (args) => (
 <svg width="400"height="100">
 <Axis {...args} />
 </svg>
 ),
 args: {
 scale: mockScale,
 height: 50,
 formatTick: (t: number) =>`${t}%`,
 },
};
