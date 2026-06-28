import type { Meta, StoryObj } from'@storybook/react';
import { Provider } from'jotai';
import RankingPanel from'./RankingPanel';

const meta: Meta<typeof RankingPanel> = {
 title:'Features/Panels/RankingPanel',
 component: RankingPanel,
 decorators: [
 (Story) => (
 <Provider>
 <div className="w-[400px] h-screen bg-[var(--elevation-surface)] border-r border-gray-200">
 <Story />
 </div>
 </Provider>
 ),
 ],
};

export default meta;
type Story = StoryObj<typeof RankingPanel>;

export const Default: Story = {};
