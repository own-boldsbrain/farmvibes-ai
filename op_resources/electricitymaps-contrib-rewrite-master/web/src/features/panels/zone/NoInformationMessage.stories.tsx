import type { Meta, StoryObj } from '@storybook/react';
import NoInformationMessage from './NoInformationMessage';

const meta: Meta<typeof NoInformationMessage> = {
  title: 'Features/NoInformationMessage',
  component: NoInformationMessage,
}};

export default meta;
type Story = StoryObj<typeof NoInformationMessage>;

export const Default: Story = {};
