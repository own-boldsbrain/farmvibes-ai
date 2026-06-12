import type { Meta, StoryObj } from'@storybook/react';
import * as ToastPrimitive from'@radix-ui/react-toast';
import Toast from'./Toast';

const meta: Meta<typeof Toast> = {
 title:'Basics/Toast',
 component: Toast,
 decorators: [
 (Story) => (
 <ToastPrimitive.Provider>
 <Story />
 </ToastPrimitive.Provider>
 ),
 ],
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Default: Story = {
 args: {
 title:'Notification Title',
 description:'This is a description of what happened.',
 },
};

export const WithAction: Story = {
 args: {
 title:'Update Available',
 description:'A new version is ready to be installed.',
 toastActionText:'Update Now',
 toastAction: () => alert('Updating...'),
 },
};
