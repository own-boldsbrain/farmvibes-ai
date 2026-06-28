import type { Meta, StoryObj } from '@storybook/react';
import { ZoneHeader } from './ZoneHeader';

const meta: Meta<typeof ZoneHeader> = {
  title: 'Features/ZoneHeader',
  component: ZoneHeader,
};

export default meta;
type Story = StoryObj<typeof ZoneHeader>;

export const Default: Story = {};
