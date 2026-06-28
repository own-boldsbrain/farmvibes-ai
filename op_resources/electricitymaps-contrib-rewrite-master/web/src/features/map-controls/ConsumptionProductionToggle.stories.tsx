import type { Meta, StoryObj } from '@storybook/react';
import ConsumptionProductionToggle from './ConsumptionProductionToggle';

const meta: Meta<typeof ConsumptionProductionToggle> = {
  title: 'Features/ConsumptionProductionToggle',
  component: ConsumptionProductionToggle,
}};

export default meta;
type Story = StoryObj<typeof ConsumptionProductionToggle>;

export const Default: Story = {};
