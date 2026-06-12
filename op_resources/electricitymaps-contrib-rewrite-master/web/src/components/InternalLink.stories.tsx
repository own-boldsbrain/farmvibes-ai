import type { Meta, StoryObj } from'@storybook/react';
import { BrowserRouter } from'react-router-dom';
import InternalLink from'./InternalLink';

const meta: Meta<typeof InternalLink> = {
 title:'Basics/InternalLink',
 component: InternalLink,
 decorators: [
 (Story) => (
 <BrowserRouter>
 <Story />
 </BrowserRouter>
 ),
 ],
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
