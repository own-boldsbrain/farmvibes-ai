import type { Meta, StoryObj } from'@storybook/react';
import TimeAxis from'./TimeAxis';
import { TimeAverages } from'utils/constants';

const meta: Meta<typeof TimeAxis> = {
 title:'Features/Time/TimeAxis',
 component: TimeAxis,
};

export default meta;
type Story = StoryObj<typeof TimeAxis>;

const mockDatetimes = Array.from({ length: 25 }).map((_, i) => {
 const d = new Date();
 d.setHours(d.getHours() - (24 - i));
 return d;
});

export const Hourly: Story = {
 args: {
 selectedTimeAggregate: TimeAverages.HOURLY,
 datetimes: mockDatetimes,
 isLoading: false,
 isLiveDisplay: true,
 className:'h-[30px] w-full',
 },
};

export const Loading: Story = {
 args: {
 selectedTimeAggregate: TimeAverages.HOURLY,
 datetimes: undefined,
 isLoading: true,
 },
};
