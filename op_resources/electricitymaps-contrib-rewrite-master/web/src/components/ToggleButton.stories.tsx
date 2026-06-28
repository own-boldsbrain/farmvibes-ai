import type { Meta, StoryObj } from '@storybook/react';
import ToggleButton from './ToggleButton';
import { mockToggleButtonDefault, mockToggleButtonSimple } from './ToggleButton.mock';

const meta: Meta<typeof ToggleButton> = {
  title: 'Basics/ToggleButton',
  component: ToggleButton,
};

export default meta;
type Story = StoryObj<typeof ToggleButton>;

export const Default: Story = {
  args: {
    ...mockToggleButtonDefault,
    onToggle: (option) => console.log('Toggled to:', option),
  },
};

export const Simple: Story = {
  args: {
    ...mockToggleButtonSimple,
    onToggle: (option) => console.log('Toggled to:', option),
  },
};
