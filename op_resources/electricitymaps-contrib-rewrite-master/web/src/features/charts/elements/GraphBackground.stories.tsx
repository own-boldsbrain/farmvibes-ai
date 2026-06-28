import type { Meta, StoryObj } from '@storybook/react';
import GraphBackground from './GraphBackground';

const meta: Meta<typeof GraphBackground> = {
  title: 'Features/GraphBackground',
  component: GraphBackground,
};

export default meta;
type Story = StoryObj<typeof GraphBackground>;

export const Default: Story = {};
