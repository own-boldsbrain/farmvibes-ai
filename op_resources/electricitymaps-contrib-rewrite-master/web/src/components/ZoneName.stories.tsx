import type { Meta, StoryObj } from'@storybook/react';
import { ZoneName } from'./ZoneName';

const meta: Meta<typeof ZoneName> = {
 title:'Basics/ZoneName',
 component: ZoneName,
};

export default meta;
type Story = StoryObj<typeof ZoneName>;

export const Default: Story = {
 args: {
 zone:'DK-DK1',
 },
};

export const CustomStyle: Story = {
 args: {
 zone:'FR',
 textStyle:'text-red-500 font-bold',
 },
};
