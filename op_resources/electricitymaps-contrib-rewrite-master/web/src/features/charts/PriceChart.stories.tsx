import type { Meta, StoryObj } from '@storybook/react';
import PriceChart from './PriceChart';

const meta: Meta<typeof PriceChart> = {
  title: 'Features/PriceChart',
  component: PriceChart,
};

export default meta;
type Story = StoryObj<typeof PriceChart>;

export const Default: Story = {};
