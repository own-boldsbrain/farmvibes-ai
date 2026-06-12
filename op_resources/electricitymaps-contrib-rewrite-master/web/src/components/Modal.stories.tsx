import type { Meta, StoryObj } from'@storybook/react';
import { useState } from'react';
import Modal from'./Modal';

const meta: Meta<typeof Modal> = {
 title:'Basics/Modal',
 component: Modal,
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
 render: (args) => {
 const [isOpen, setIsOpen] = useState(true);
 return (
 <div>
 <button onClick={() => setIsOpen(true)} className="bg-blue-500 text-white px-4 py-2">Open Modal</button>
 <Modal {...args} isOpen={isOpen} setIsOpen={setIsOpen}>
 <p>This is the modal content.</p>
 </Modal>
 </div>
 );
 },
 args: {
 title:'Example Modal',
 },
};
