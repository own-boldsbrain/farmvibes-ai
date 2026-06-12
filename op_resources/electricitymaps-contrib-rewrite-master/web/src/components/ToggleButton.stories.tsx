import type { Meta, StoryObj } from'@storybook/react';
import { ToggleButton } from'./ToggleButton';

const meta: Meta<typeof ToggleButton> = {
 title:'Basics/ToggleButton',
 component: ToggleButton,
};

export default meta;
type Story = StoryObj<typeof ToggleButton>;

export const All: Story = {
 render: () => (
 <div className="flex flex-col gap-4">
 <div className="flex gap-2">
 <ToggleButton active={true} onClick={() => {}}>Active</ToggleButton>
 <ToggleButton active={false} onClick={() => {}}>Inactive</ToggleButton>
 </div>
 <div>
 <ToggleButton className="bg-red-500 text-white"active={true} onClick={() => {}}>Custom Class</ToggleButton>
 </div>
 </div>
 ),
};
