import type { Meta, StoryObj } from'@storybook/react';
import { scaleLinear } from'd3-scale';
import ValueAxis from'./ValueAxis';

const meta: Meta<typeof ValueAxis> = {
 title:'Features/Charts/Elements/ValueAxis',
 component: ValueAxis,
};

export default meta;
type Story = StoryObj<typeof ValueAxis>;

const mockScale = scaleLinear().domain([0, 1000]).range([200, 0]);

export const Default: Story = {
 render: (args) => (
 <svg width="400"height="250">
 <ValueAxis {...args} />
 </svg>
 ),
 args: {
 scale: mockScale,
 label:'gCO2eq / kWh',
 width: 300,
 height: 200,
 },
};
