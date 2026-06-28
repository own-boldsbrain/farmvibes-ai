import type { Meta, StoryObj } from '@storybook/react';
import BarBreakdownChart from './BarBreakdownChart';

const meta: Meta<typeof BarBreakdownChart> = {
  title: 'Features/BarBreakdownChart',
  component: BarBreakdownChart,
}};

export default meta;
type Story = StoryObj<typeof BarBreakdownChart>;

export const Default: Story = {};
