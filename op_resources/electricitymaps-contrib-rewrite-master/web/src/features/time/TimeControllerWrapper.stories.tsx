import type { Meta, StoryObj } from '@storybook/react';
import TimeControllerWrapper from './TimeControllerWrapper';

const meta: Meta<typeof TimeControllerWrapper> = {
  title: 'Features/TimeControllerWrapper',
  component: TimeControllerWrapper,
}};

export default meta;
type Story = StoryObj<typeof TimeControllerWrapper>;

export const Default: Story = {};
