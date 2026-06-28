import type { Meta, StoryObj } from '@storybook/react';
import CustomLayer from './CustomLayer';

const meta: Meta<typeof CustomLayer> = {
  title: 'Features/CustomLayer',
  component: CustomLayer,
}};

export default meta;
type Story = StoryObj<typeof CustomLayer>;

export const Default: Story = {};
