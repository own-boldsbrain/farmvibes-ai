import type { Meta, StoryObj } from'@storybook/react';
import { Provider } from'jotai';
import LegendContainer from'./LegendContainer';
import { solarLayerEnabledAtom, windLayerAtom, selectedDatetimeIndexAtom } from'utils/state/atoms';
import { ToggleOptions } from'utils/constants';

const meta: Meta<typeof LegendContainer> = {
 title:'Basics/Legends/LegendContainer',
 component: LegendContainer,
 decorators: [
 (Story) => (
 <Provider>
 <div className="relative w-full h-[300px] bg-[var(--elevation-low)] p-8">
 <Story />
 </div>
 </Provider>
 ),
 ],
};

export default meta;
type Story = StoryObj<typeof LegendContainer>;

export const AllEnabled: Story = {
 play: ({ canvasElement }) => {
 // Note: Atom initialization for Storybook usually requires a specific wrapper or hydration logic.
 // For now, this shows the component structure.
 }
};
