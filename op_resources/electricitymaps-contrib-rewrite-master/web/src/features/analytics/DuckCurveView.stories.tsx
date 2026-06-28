import type { Meta, StoryObj } from '@storybook/react';
import DuckCurveView from './DuckCurveView';

const meta: Meta<typeof DuckCurveView> = {
  title: 'Features/DuckCurveView',
  component: DuckCurveView,
}};

export default meta;
type Story = StoryObj<typeof DuckCurveView>;

export const Default: Story = {};
