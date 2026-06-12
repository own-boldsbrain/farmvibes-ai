import type { Meta, StoryObj } from'@storybook/react';
import { CountryFlag } from'./Flag';

const meta: Meta<typeof CountryFlag> = {
 title:'Basics/CountryFlag',
 component: CountryFlag,
};

export default meta;
type Story = StoryObj<typeof CountryFlag>;

export const All: Story = {
 render: () => (
 <div className="flex flex-wrap gap-4 items-center">
 <CountryFlag zoneId="DK"size={24} />
 <CountryFlag zoneId="FR"size={24} />
 <CountryFlag zoneId="DE"size={24} />
 <CountryFlag zoneId="BR"size={24} />
 <CountryFlag zoneId="US"size={24} />
 <CountryFlag zoneId="AUS"size={24} />
 <CountryFlag zoneId="UNKNOWN"size={24} />
 </div>
 ),
};
