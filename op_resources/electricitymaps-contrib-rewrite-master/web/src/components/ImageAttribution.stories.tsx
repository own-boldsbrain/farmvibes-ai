import type { Meta, StoryObj } from'@storybook/react';
import ImageAttribution from'./ImageAttribution';

const meta: Meta<typeof ImageAttribution> = {
 title:'Basics/ImageAttribution',
 component: ImageAttribution,
 decorators: [
 (Story) => (
 <div className="relative w-[300px] h-[200px] bg-gray-800">
 <Story />
 </div>
 ),
 ],
};

export default meta;
type Story = StoryObj<typeof ImageAttribution>;

export const Default: Story = {
 args: {
 author: {
 name:'John Doe',
 url:'https://unsplash.com/@johndoe',
 },
 },
};
