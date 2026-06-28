import type { Meta, StoryObj } from '@storybook/react';
import BialekView from './BialekView';

const meta: Meta<typeof BialekView> = {
  title: 'Features/BialekView',
  component: BialekView,
}};

export default meta;
type Story = StoryObj<typeof BialekView>;

export const Default: Story = {};
