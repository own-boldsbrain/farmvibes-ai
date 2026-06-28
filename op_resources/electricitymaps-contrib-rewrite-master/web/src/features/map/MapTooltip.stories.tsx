import type { Meta, StoryObj } from '@storybook/react';
import MapTooltip from './MapTooltip';

const meta: Meta<typeof MapTooltip> = {
  title: 'Features/MapTooltip',
  component: MapTooltip,
};

export default meta;
type Story = StoryObj<typeof MapTooltip>;

export const Default: Story = {};
