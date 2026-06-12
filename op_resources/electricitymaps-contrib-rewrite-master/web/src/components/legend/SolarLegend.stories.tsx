import type { Meta, StoryObj } from'@storybook/react';
import SolarLegend from'./SolarLegend';

const meta: Meta<typeof SolarLegend> = {
 title:'Basics/Legends/SolarLegend',
 component: SolarLegend,
};

export default meta;
type Story = StoryObj<typeof SolarLegend>;

export const Default: Story = {};
