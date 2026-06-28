import type { Meta, StoryObj } from '@storybook/react';
import { TimeDisplay } from './TimeDisplay';

// Mock translation and state to make Storybook happy
import { Provider } from 'jotai';
import { timeAverageAtom, selectedDatetimeIndexAtom } from 'utils/state/atoms';

const meta: Meta<typeof TimeDisplay> = {
  title: 'Telemetry/TimeDisplay',
  component: TimeDisplay,
  decorators: [
    (Story) => (
      <Provider>
        <Story />
      </Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TimeDisplay>;

export const Default: Story = {
  args: {
    className: 'text-zinc-900 font-mono text-sm dark:text-zinc-100',
  },
};
