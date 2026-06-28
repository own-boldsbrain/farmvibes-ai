import type { Meta, StoryObj } from '@storybook/react';
import ConcessionariasPanel from './ConcessionariasPanel';

const meta: Meta<typeof ConcessionariasPanel> = {
  title: 'Features/ConcessionariasPanel',
  component: ConcessionariasPanel,
};

export default meta;
type Story = StoryObj<typeof ConcessionariasPanel>;

export const Default: Story = {};
