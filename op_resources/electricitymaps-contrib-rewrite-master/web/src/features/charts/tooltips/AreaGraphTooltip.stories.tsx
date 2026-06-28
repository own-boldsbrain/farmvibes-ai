import type { Meta, StoryObj } from '@storybook/react';
import AreaGraphTooltip from './AreaGraphTooltip';

const meta: Meta<typeof AreaGraphTooltip> = {
  title: 'Features/AreaGraphTooltip',
  component: AreaGraphTooltip,
};

export default meta;
type Story = StoryObj<typeof AreaGraphTooltip>;

export const Default: Story = {};
