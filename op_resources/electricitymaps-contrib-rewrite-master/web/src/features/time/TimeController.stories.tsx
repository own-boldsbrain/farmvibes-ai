import type { Meta, StoryObj } from'@storybook/react';
import { Provider } from'jotai';
import TimeController from'./TimeController';

const meta: Meta<typeof TimeController> = {
 title:'Features/Time/TimeController',
 component: TimeController,
 decorators: [
 (Story) => (
 <Provider>
 <div className="w-[400px] p-4 bg-[var(--elevation-surface)]">
 <Story />
 </div>
 </Provider>
 ),
 ],
};

export default meta;
type Story = StoryObj<typeof TimeController>;

export const Default: Story = {};
