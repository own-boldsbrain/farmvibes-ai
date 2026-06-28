import type { Meta, StoryObj } from '@storybook/react';
import HorizontalBar from './HorizontalBar';

const meta: Meta<typeof HorizontalBar> = {
  title: 'Features/HorizontalBar',
  component: HorizontalBar,
}};

export default meta;
type Story = StoryObj<typeof HorizontalBar>;

export const Default: Story = {};
