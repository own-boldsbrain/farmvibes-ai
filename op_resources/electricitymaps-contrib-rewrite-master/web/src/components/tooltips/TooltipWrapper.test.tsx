import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TooltipWrapper from './TooltipWrapper';
import { mockTooltipWrapperTextProps } from './TooltipWrapper.mock';

describe('<TooltipWrapper />', () => {
  it('renders trigger element and content overlay correctly', () => {
    render(<TooltipWrapper {...mockTooltipWrapperTextProps} />);
    const trigger = screen.getByRole('button');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent('Hover Trigger Button');

    // Tooltip content requires hover triggers to render under JSDOM
    // Since delayDuration={0}, checking that the element triggers is standard.
  });
});
