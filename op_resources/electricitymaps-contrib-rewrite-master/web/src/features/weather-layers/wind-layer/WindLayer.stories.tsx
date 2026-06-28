import type { Meta, StoryObj } from '@storybook/react';
import WindLayer from './WindLayer';

const meta: Meta<typeof WindLayer> = {
  title: 'Features/WindLayer',
  component: WindLayer,
};

export default meta;
type Story = StoryObj<typeof WindLayer>;

export const Default: Story = {};
