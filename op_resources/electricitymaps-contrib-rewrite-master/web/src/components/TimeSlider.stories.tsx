import type { Meta, StoryObj } from'@storybook/react';
import TimeSlider from'./TimeSlider';

const meta: Meta<typeof TimeSlider> = {
 title:'Basics/TimeSlider',
 component: TimeSlider,
};

export default meta;
type Story = StoryObj<typeof TimeSlider>;

export const Default: Story = {
 args: {
 numberOfEntries: 24,
 selectedIndex: 10,
 onChange: (idx: number) => console.log('Index changed to:', idx),
 },
};
