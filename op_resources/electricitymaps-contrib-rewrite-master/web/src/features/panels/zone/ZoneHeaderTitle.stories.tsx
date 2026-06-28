import type { Meta, StoryObj } from '@storybook/react';
import ZoneHeaderTitle from './ZoneHeaderTitle';

const meta: Meta<typeof ZoneHeaderTitle> = {
  title: 'Features/ZoneHeaderTitle',
  component: ZoneHeaderTitle,
};

export default meta;
type Story = StoryObj<typeof ZoneHeaderTitle>;

export const Default: Story = {};
