import type { Meta, StoryObj } from'@storybook/react';
import Logo from'./Logo';

const meta: Meta<typeof Logo> = {
 title:'Features/Header/Logo',
 component: Logo,
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const Default: Story = {
 args: {
 className:'h-12 w-56 fill-black',
 },
};

export const Small: Story = {
 args: {
 className:'h-6 w-24 fill-green-500',
 },
};
