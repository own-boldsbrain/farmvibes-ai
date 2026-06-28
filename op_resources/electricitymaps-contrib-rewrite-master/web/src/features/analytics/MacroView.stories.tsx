import type { Meta, StoryObj } from '@storybook/react';
import MacroView from './MacroView';

const meta: Meta<typeof MacroView> = {
  title: 'Features/MacroView',
  component: MacroView,
};

export default meta;
type Story = StoryObj<typeof MacroView>;

export const Default: Story = {};
