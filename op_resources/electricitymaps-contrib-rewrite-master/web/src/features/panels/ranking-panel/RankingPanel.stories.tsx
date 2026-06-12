import type { Meta, StoryObj } from'@storybook/react';
import { Provider } from'jotai';
import { BrowserRouter } from'react-router-dom';
import RankingPanel from'./RankingPanel';

const meta: Meta<typeof RankingPanel> = {
 title:'Features/Panels/RankingPanel',
 component: RankingPanel,
 decorators: [
 (Story) => (
 <Provider>
 <BrowserRouter>
 <div className="w-[400px] h-screen bg-[var(--elevation-surface)] border-r border-gray-200">
 <Story />
 </div>
 </BrowserRouter>
 </Provider>
 ),
 ],
};

export default meta;
type Story = StoryObj<typeof RankingPanel>;

export const Default: Story = {};
