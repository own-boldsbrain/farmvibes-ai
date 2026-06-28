import type { Meta, StoryObj } from '@storybook/react';
import AreaGraphContainer from './AreaGraphContainer';

const meta: Meta<typeof AreaGraphContainer> = {
  title: 'Features/AreaGraphContainer',
  component: AreaGraphContainer,
};

export default meta;
type Story = StoryObj<typeof AreaGraphContainer>;

export const Default: Story = {};
