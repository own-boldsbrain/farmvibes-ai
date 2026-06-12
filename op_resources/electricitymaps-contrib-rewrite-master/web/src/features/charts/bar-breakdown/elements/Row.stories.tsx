import type { Meta, StoryObj } from'@storybook/react';
import { scaleLinear } from'd3-scale';
import Row from'./Row';
import HorizontalBar from'./HorizontalBar';

const meta: Meta<typeof Row> = {
 title:'Features/Charts/BarBreakdown/Elements/Row',
 component: Row,
};

export default meta;
type Story = StoryObj<typeof Row>;

const mockScale = scaleLinear().domain([0, 100]).range([0, 200]);

export const Default: Story = {
 render: (args) => (
 <svg width="400"height="50">
 <Row {...args}>
 <HorizontalBar className="bar"fill="#44ab60"range={[0, 75]} scale={mockScale} />
 </Row>
 </svg>
 ),
 args: {
 index: 0,
 isMobile: false,
 label:'Wind',
 scale: mockScale,
 value: 75,
 width: 300,
 },
};
