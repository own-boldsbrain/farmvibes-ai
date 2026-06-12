import type { Meta, StoryObj } from'@storybook/react';
import LoadingOrError from'./LoadingOrError';

const meta: Meta<typeof LoadingOrError> = {
 title:'Basics/LoadingOrError',
 component: LoadingOrError,
};

export default meta;
type Story = StoryObj<typeof LoadingOrError>;

export const Loading: Story = {
 args: {},
};

export const Error: Story = {
 args: {
 error: new Error('Failed to load data from API'),
 },
};
