import type { Meta, StoryObj } from'@storybook/react';
import { Provider } from'jotai';
import LoadingOverlay from'./LoadingOverlay';

const meta: Meta<typeof LoadingOverlay> = {
 title:'Basics/LoadingOverlay',
 component: LoadingOverlay,
 decorators: [
 (Story) => (
 <Provider>
 <div className="relative w-full h-[300px]">
 <Story />
 </div>
 </Provider>
 ),
 ],
};

export default meta;
type Story = StoryObj<typeof LoadingOverlay>;

// Note: LoadingOverlay visibility depends on global state atoms.
// This story shows the component structure.
export const Default: Story = {};
