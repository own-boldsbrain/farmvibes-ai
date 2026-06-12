import type { Meta, StoryObj } from'@storybook/react';
import Header from'./Header';

const meta: Meta<typeof Header> = {
 title:'Features/Header/Header',
 component: Header,
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
 render: () => (
 <div className="w-full">
 <Header />
 </div>
 ),
};
