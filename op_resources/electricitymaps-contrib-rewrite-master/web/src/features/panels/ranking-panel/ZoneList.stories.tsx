import type { Meta, StoryObj } from '@storybook/react';
import ZoneList from './ZoneList';

const meta: Meta<typeof ZoneList> = {
  title: 'Features/ZoneList',
  component: ZoneList,
}};

export default meta;
type Story = StoryObj<typeof ZoneList>;

export const Default: Story = {};
