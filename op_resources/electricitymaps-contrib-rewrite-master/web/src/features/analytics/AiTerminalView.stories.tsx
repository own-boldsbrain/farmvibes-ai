import type { Meta, StoryObj } from '@storybook/react';
import AiTerminalView from './AiTerminalView';

const meta: Meta<typeof AiTerminalView> = {
  title: 'Features/AiTerminalView',
  component: AiTerminalView,
};

export default meta;
type Story = StoryObj<typeof AiTerminalView>;

export const Default: Story = {};
