import type { Meta, StoryObj } from '@storybook/react';
import InfoText from './InfoText';

const meta: Meta<typeof InfoText> = {
  title: 'Features/InfoText',
  component: InfoText,
}};

export default meta;
type Story = StoryObj<typeof InfoText>;

export const Default: Story = {};
