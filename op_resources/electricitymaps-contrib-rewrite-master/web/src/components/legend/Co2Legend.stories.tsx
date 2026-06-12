import type { Meta, StoryObj } from'@storybook/react';
import Co2Legend from'./Co2Legend';

const meta: Meta<typeof Co2Legend> = {
 title:'Basics/Legends/Co2Legend',
 component: Co2Legend,
};

export default meta;
type Story = StoryObj<typeof Co2Legend>;

export const Default: Story = {};
