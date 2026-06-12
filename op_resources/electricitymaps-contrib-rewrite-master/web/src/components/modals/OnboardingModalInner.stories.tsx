import type { Meta, StoryObj } from'@storybook/react';
import Modal from'./OnboardingModalInner';

const meta: Meta<typeof Modal> = {
 title:'Basics/Modals/OnboardingModalInner',
 component: Modal,
};

export default meta;
type Story = StoryObj<typeof Modal>;

const mockViews = [
 {
 headerImage: { pathname:'https://via.placeholder.com/200'},
 isMainTitle: true,
 renderContent: () => <div><h1>Step 1</h1><p>Welcome to the app.</p></div>,
 },
 {
 headerImage: { pathname:'https://via.placeholder.com/400x200'},
 renderContent: () => <div><h2>Step 2</h2><p>Here is how it works.</p></div>,
 },
];

export const Default: Story = {
 args: {
 modalName:'onboarding-test',
 visible: true,
 views: mockViews,
 onDismiss: () => console.log('Dismissed'),
 },
};
