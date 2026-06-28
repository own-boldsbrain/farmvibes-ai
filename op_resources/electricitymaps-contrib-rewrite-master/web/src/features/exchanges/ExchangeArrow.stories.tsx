import type { Meta, StoryObj } from '@storybook/react';
import ExchangeArrow from './ExchangeArrow';

const meta: Meta<typeof ExchangeArrow> = {
  title: 'Features/ExchangeArrow',
  component: ExchangeArrow,
};

export default meta;
type Story = StoryObj<typeof ExchangeArrow>;

export const Default: Story = {};
