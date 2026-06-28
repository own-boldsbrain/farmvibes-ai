import type { Meta, StoryObj } from '@storybook/react';
import EmissionChartTooltip from './EmissionChartTooltip';

const meta: Meta<typeof EmissionChartTooltip> = {
  title: 'Features/EmissionChartTooltip',
  component: EmissionChartTooltip,
};

export default meta;
type Story = StoryObj<typeof EmissionChartTooltip>;

export const Default: Story = {};
