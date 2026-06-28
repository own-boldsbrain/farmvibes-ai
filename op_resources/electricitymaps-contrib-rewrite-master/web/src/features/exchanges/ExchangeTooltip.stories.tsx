import type { Meta, StoryObj } from '@storybook/react';
import ExchangeTooltip from './ExchangeTooltip';

const meta: Meta<typeof ExchangeTooltip> = {
  title: 'Features/ExchangeTooltip',
  component: ExchangeTooltip,
};

export default meta;
type Story = StoryObj<typeof ExchangeTooltip>;

export const Default: Story = {};
