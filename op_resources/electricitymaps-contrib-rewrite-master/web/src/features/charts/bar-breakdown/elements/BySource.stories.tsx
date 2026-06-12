import type { Meta, StoryObj } from'@storybook/react';
import { Provider } from'jotai';
import BySource from'./BySource';

const meta: Meta<typeof BySource> = {
 title:'Features/Charts/BarBreakdown/Elements/BySource',
 component: BySource,
 decorators: [
 (Story) => (
 <Provider>
 <div className="w-[300px] p-4">
 <Story />
 </div>
 </Provider>
 ),
 ],
};

export default meta;
type Story = StoryObj<typeof BySource>;

export const Default: Story = {};
