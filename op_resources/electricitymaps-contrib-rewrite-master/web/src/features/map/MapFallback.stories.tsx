import type { Meta, StoryObj } from '@storybook/react';
import MapFallback from './MapFallback';

const meta: Meta<typeof MapFallback> = {
  title: 'Features/MapFallback',
  component: MapFallback,
}};

export default meta;
type Story = StoryObj<typeof MapFallback>;

export const Default: Story = {};
