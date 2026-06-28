import type { Meta, StoryObj } from '@storybook/react';
import MapWrapper from './MapWrapper';

const meta: Meta<typeof MapWrapper> = {
  title: 'Features/MapWrapper',
  component: MapWrapper,
}};

export default meta;
type Story = StoryObj<typeof MapWrapper>;

export const Default: Story = {};
