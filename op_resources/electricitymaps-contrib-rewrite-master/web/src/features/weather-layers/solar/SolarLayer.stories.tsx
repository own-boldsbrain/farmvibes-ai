import type { Meta, StoryObj } from '@storybook/react';
import SolarLayer from './SolarLayer';

const meta: Meta<typeof SolarLayer> = {
  title: 'Features/SolarLayer',
  component: SolarLayer,
};

export default meta;
type Story = StoryObj<typeof SolarLayer>;

export const Default: Story = {};
