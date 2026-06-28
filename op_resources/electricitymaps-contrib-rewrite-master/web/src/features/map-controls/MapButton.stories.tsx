import type { Meta, StoryObj } from '@storybook/react';
import MapButton from './MapButton';

const meta: Meta<typeof MapButton> = {
  title: 'Features/MapButton',
  component: MapButton,
};

export default meta;
type Story = StoryObj<typeof MapButton>;

export const Default: Story = {};
