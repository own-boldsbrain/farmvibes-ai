import type { Meta, StoryObj } from '@storybook/react';
import TimeHeader from './TimeHeader';

const meta: Meta<typeof TimeHeader> = {
  title: 'Features/TimeHeader',
  component: TimeHeader,
}};

export default meta;
type Story = StoryObj<typeof TimeHeader>;

export const Default: Story = {};
