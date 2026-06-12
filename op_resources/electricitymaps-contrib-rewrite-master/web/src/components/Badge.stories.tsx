import type { Meta, StoryObj } from'@storybook/react';
import Badge from'./Badge';

const meta: Meta<typeof Badge> = {
 title:'Basics/Badge',
 component: Badge,
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const All: Story = {
 render: () => (
 <div className="flex flex-col gap-4">
 <div>
 <h4 className="mb-2 text-sm text-[var(--color-text-secondary)]">Default</h4>
 <Badge>Default Badge</Badge>
 </div>
 <div>
 <h4 className="mb-2 text-sm text-[var(--color-text-secondary)]">Warning</h4>
 <Badge type="warning">Warning Badge</Badge>
 </div>
 <div>
 <h4 className="mb-2 text-sm text-[var(--color-text-secondary)]">Custom Class</h4>
 <Badge className="bg-blue-500 text-white">Custom Badge</Badge>
 </div>
 </div>
 ),
};
