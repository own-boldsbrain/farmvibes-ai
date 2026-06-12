import type { Meta, StoryObj } from'@storybook/react';
import TimeAverageToggle from'./TimeAverageToggle';
import { TimeAverages } from'utils/constants';

const meta: Meta<typeof TimeAverageToggle> = {
 title:'Basics/TimeAverageToggle',
 component: TimeAverageToggle,
};

export default meta;
type Story = StoryObj<typeof TimeAverageToggle>;

import { useState } from 'react';

export const All: Story = {
 render: () => {
 const [val, setVal] = useState(TimeAverages.HOURLY);
 return <TimeAverageToggle timeAverage={val} onToggleGroupClick={setVal} />;
 },
};
