import type { Meta, StoryObj } from '@storybook/react';
import AnalyticsLayout from './AnalyticsLayout';

const meta: Meta<typeof AnalyticsLayout> = {
  title: 'Features/AnalyticsLayout',
  component: AnalyticsLayout,
};

export default meta;
type Story = StoryObj<typeof AnalyticsLayout>;

export const Default: Story = {};
