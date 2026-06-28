import type { Meta, StoryObj } from '@storybook/react';
import EmptyBarBreakdownChart from './EmptyBarBreakdownChart';

const meta: Meta<typeof EmptyBarBreakdownChart> = {
  title: 'Features/EmptyBarBreakdownChart',
  component: EmptyBarBreakdownChart,
};

export default meta;
type Story = StoryObj<typeof EmptyBarBreakdownChart>;

export const Default: Story = {};
