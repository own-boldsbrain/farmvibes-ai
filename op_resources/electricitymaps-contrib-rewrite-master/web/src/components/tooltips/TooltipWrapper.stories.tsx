import type { Meta, StoryObj } from'@storybook/react';
import TooltipWrapper from'./TooltipWrapper';

const meta: Meta<typeof TooltipWrapper> = {
 title:'Basics/Tooltips/TooltipWrapper',
 component: TooltipWrapper,
};

export default meta;
type Story = StoryObj<typeof TooltipWrapper>;

export const Default: Story = {
 args: {
 tooltipContent:'This is a tooltip message',
 children: <button className="bg-[var(--elevation-low)] p-2">Hover me</button>,
 side:'top',
 },
};

export const CustomElement: Story = {
 args: {
 tooltipContent: <div className="text-red-500 font-bold">Rich Content</div>,
 children: <span className="underline cursor-help">Hover for rich content</span>,
 side:'right',
 },
};
