import type { Meta, StoryObj } from '@storybook/react';
import DisplayByEmissionToggle from './DisplayByEmissionToggle';

const meta: Meta<typeof DisplayByEmissionToggle> = {
  title: 'Features/DisplayByEmissionToggle',
  component: DisplayByEmissionToggle,
};

export default meta;
type Story = StoryObj<typeof DisplayByEmissionToggle>;

export const Default: Story = {};
