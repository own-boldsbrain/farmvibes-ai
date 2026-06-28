import type { Meta, StoryObj } from '@storybook/react';
import { OnboardingModal } from './OnboardingModal';
import { Provider } from 'jotai';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof OnboardingModal> = {
  title: 'Modals/OnboardingModal',
  component: OnboardingModal,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Provider>
          <Story />
        </Provider>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof OnboardingModal>;

export const Default: Story = {};
