import type { Meta, StoryObj } from '@storybook/react';
import BreakdownChart from './BreakdownChart';

const meta: Meta<typeof BreakdownChart> = {
  title: 'Features/BreakdownChart',
  component: BreakdownChart,
}};

export default meta;
type Story = StoryObj<typeof BreakdownChart>;

export const Default: Story = {};
