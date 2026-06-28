import type { Meta, StoryObj } from '@storybook/react';
import PriceChartTooltip from './PriceChartTooltip';

const meta: Meta<typeof PriceChartTooltip> = {
  title: 'Features/PriceChartTooltip',
  component: PriceChartTooltip,
};

export default meta;
type Story = StoryObj<typeof PriceChartTooltip>;

export const Default: Story = {};
