import type { Meta, StoryObj } from '@storybook/react';
import SocialButtons from './SocialButtons';

const meta: Meta<typeof SocialButtons> = {
  title: 'Features/SocialButtons',
  component: SocialButtons,
};

export default meta;
type Story = StoryObj<typeof SocialButtons>;

export const Default: Story = {};
