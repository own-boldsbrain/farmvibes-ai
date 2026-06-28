import type { Meta, StoryObj } from'@storybook/react';
import InternalLink from'./InternalLink';

const meta: Meta<typeof InternalLink> = {
 title:'Basics/InternalLink',
 component: InternalLink,
};

export default meta;
type Story = StoryObj<typeof InternalLink>;

export const Default: Story = {
 args: {
 to:'/some-path',
 children:'Internal Link Example',
 className:'text-blue-500 underline',
 },
};
