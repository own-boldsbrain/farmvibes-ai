import type { Meta, StoryObj } from '@storybook/react';
import AreaGraphLayers from './AreaGraphLayers';

const meta: Meta<typeof AreaGraphLayers> = {
  title: 'Features/AreaGraphLayers',
  component: AreaGraphLayers,
}};

export default meta;
type Story = StoryObj<typeof AreaGraphLayers>;

export const Default: Story = {};
