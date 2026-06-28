import type { Meta, StoryObj } from '@storybook/react';
import AreaGraph from './AreaGraph';

const meta: Meta<typeof AreaGraph> = {
  title: 'Features/AreaGraph',
  component: AreaGraph,
};

export default meta;
type Story = StoryObj<typeof AreaGraph>;

export const Default: Story = {};
