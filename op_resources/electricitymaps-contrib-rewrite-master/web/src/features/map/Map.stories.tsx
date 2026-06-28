import type { Meta, StoryObj } from '@storybook/react';
import Map from './Map';

const meta: Meta<typeof Map> = {
  title: 'Features/Map',
  component: Map,
};

export default meta;
type Story = StoryObj<typeof Map>;

export const Default: Story = {};
