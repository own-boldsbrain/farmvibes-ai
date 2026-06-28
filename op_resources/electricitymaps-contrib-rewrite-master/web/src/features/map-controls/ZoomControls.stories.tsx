import type { Meta, StoryObj } from '@storybook/react';
import ZoomControls from './ZoomControls';

const meta: Meta<typeof ZoomControls> = {
  title: 'Features/ZoomControls',
  component: ZoomControls,
}};

export default meta;
type Story = StoryObj<typeof ZoomControls>;

export const Default: Story = {};
