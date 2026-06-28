import type { Meta, StoryObj } from '@storybook/react';
import FAQPanel from './FAQPanel';

const meta: Meta<typeof FAQPanel> = {
  title: 'Features/FAQPanel',
  component: FAQPanel,
};

export default meta;
type Story = StoryObj<typeof FAQPanel>;

export const Default: Story = {};
