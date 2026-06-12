import type { Meta, StoryObj } from'@storybook/react';
import WindLegend from'./WindLegend';

const meta: Meta<typeof WindLegend> = {
 title:'Basics/Legends/WindLegend',
 component: WindLegend,
};

export default meta;
type Story = StoryObj<typeof WindLegend>;

export const Default: Story = {};
