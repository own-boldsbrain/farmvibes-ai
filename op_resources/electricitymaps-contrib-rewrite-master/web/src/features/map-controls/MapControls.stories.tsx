import type { Meta, StoryObj } from '@storybook/react';
import MapControls from './MapControls';

const meta: Meta<typeof MapControls> = {
  title: 'Features/MapControls',
  component: MapControls,
};

export default meta;
type Story = StoryObj<typeof MapControls>;

export const Default: Story = {};
