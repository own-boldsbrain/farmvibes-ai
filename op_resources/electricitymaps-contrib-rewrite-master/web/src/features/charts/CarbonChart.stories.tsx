import type { Meta, StoryObj } from '@storybook/react';
import CarbonChart from './CarbonChart';

const meta: Meta<typeof CarbonChart> = {
  title: 'Features/CarbonChart',
  component: CarbonChart,
};

export default meta;
type Story = StoryObj<typeof CarbonChart>;

export const Default: Story = {};
