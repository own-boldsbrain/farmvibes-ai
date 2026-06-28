import type { Meta, StoryObj } from '@storybook/react';
import SpatialAggregatesToggle from './SpatialAggregatesToggle';

const meta: Meta<typeof SpatialAggregatesToggle> = {
  title: 'Features/SpatialAggregatesToggle',
  component: SpatialAggregatesToggle,
};

export default meta;
type Story = StoryObj<typeof SpatialAggregatesToggle>;

export const Default: Story = {};
