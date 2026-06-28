import type { Meta, StoryObj } from '@storybook/react';
import FAQContent from './FAQContent';

const meta: Meta<typeof FAQContent> = {
  title: 'Features/FAQContent',
  component: FAQContent,
};

export default meta;
type Story = StoryObj<typeof FAQContent>;

export const Default: Story = {};
