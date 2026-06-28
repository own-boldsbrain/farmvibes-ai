import type { Meta, StoryObj } from '@storybook/react';
import { OnboardingModal } from './OnboardingModal';
import { Provider } from 'jotai';

const meta: Meta<typeof OnboardingModal> = {
  title: 'Modals/OnboardingModal',
  component: OnboardingModal,
  decorators: [
    (Story) => (
      <Provider>
        <Story />
      </Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof OnboardingModal>;

export const Default: Story = {};
