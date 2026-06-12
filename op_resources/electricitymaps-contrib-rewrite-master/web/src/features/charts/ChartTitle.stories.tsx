import type { Meta, StoryObj } from'@storybook/react';
import { Provider } from'jotai';
import { ChartTitle } from'./ChartTitle';

const meta: Meta<typeof ChartTitle> = {
 title:'Features/Charts/ChartTitle',
 component: ChartTitle,
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
type Story = StoryObj<typeof ChartTitle>;

export const CarbonIntensity: Story = {
 args: {
 translationKey:'country-history.carbonintensity',
 },
};

export const Emissions: Story = {
 args: {
 translationKey:'country-history.emissions',
 },
};
