import type { Meta, StoryObj } from '@storybook/react';
import ZoneDetails from './ZoneDetails';

const meta: Meta<typeof ZoneDetails> = {
  title: 'Features/ZoneDetails',
  component: ZoneDetails,
}};

export default meta;
type Story = StoryObj<typeof ZoneDetails>;

export const Default: Story = {};
