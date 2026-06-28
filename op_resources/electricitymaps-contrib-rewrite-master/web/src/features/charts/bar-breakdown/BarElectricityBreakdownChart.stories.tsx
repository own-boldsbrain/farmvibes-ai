import type { Meta, StoryObj } from '@storybook/react';
import BarElectricityBreakdownChart from './BarElectricityBreakdownChart';

const meta: Meta<typeof BarElectricityBreakdownChart> = {
  title: 'Features/BarElectricityBreakdownChart',
  component: BarElectricityBreakdownChart,
}};

export default meta;
type Story = StoryObj<typeof BarElectricityBreakdownChart>;

export const Default: Story = {};
