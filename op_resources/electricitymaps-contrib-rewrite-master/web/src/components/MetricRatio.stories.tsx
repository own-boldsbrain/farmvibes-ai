import type { Meta, StoryObj } from'@storybook/react';
import { MetricRatio } from'./MetricRatio';

const meta: Meta<typeof MetricRatio> = {
 title:'Basics/MetricRatio',
 component: MetricRatio,
};

export default meta;
type Story = StoryObj<typeof MetricRatio>;

export const Default: Story = {
 args: {
 value: 450,
 total: 1000,
 format: (v: number) =>`${v}MW`,
 },
};

export const PartialData: Story = {
 args: {
 value: NaN,
 total: 1000,
 format: (v: number) =>`${v}`,
 },
};
