import type { Meta, StoryObj } from '@storybook/react';
import BarBreakdownEmissionsChart from './BarBreakdownEmissionsChart';

const meta: Meta<typeof BarBreakdownEmissionsChart> = {
  title: 'Features/BarBreakdownEmissionsChart',
  component: BarBreakdownEmissionsChart,
};

export default meta;
type Story = StoryObj<typeof BarBreakdownEmissionsChart>;

export const Default: Story = {};
