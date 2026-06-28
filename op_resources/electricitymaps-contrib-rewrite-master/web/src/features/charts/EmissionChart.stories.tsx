import type { Meta, StoryObj } from '@storybook/react';
import EmissionChart from './EmissionChart';

const meta: Meta<typeof EmissionChart> = {
  title: 'Features/EmissionChart',
  component: EmissionChart,
}};

export default meta;
type Story = StoryObj<typeof EmissionChart>;

export const Default: Story = {};
