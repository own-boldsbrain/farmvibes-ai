import type { Meta, StoryObj } from '@storybook/react';
import CarbonChartTooltip from './CarbonChartTooltip';

const meta: Meta<typeof CarbonChartTooltip> = {
  title: 'Features/CarbonChartTooltip',
  component: CarbonChartTooltip,
};

export default meta;
type Story = StoryObj<typeof CarbonChartTooltip>;

export const Default: Story = {};
