import type { Meta, StoryObj } from '@storybook/react';
import SearchBar from './SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'Features/SearchBar',
  component: SearchBar,
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {};
