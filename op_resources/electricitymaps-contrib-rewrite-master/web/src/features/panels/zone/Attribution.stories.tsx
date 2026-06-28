import type { Meta, StoryObj } from '@storybook/react';
import Attribution from './Attribution';

const meta: Meta<typeof Attribution> = {
  title: 'Features/Attribution',
  component: Attribution,
}};

export default meta;
type Story = StoryObj<typeof Attribution>;

export const Default: Story = {};
