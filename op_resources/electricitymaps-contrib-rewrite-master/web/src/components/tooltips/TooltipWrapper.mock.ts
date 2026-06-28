import React from 'react';

export const mockTooltipWrapperTextProps = {
  tooltipContent: 'Tooltip details text',
  children: React.createElement('button', null, 'Hover Trigger Button'),
};

export const mockTooltipWrapperCustomProps = {
  tooltipContent: React.createElement('span', null, 'Custom element content'),
  children: React.createElement('div', null, 'Hover Trigger Div'),
  side: 'right' as const,
  tooltipClassName: 'custom-tooltip-class',
};
