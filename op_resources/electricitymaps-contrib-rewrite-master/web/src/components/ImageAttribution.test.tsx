import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ImageAttribution from './ImageAttribution';
import { mockImageAttributionProps } from './ImageAttribution.mock';

describe('<ImageAttribution />', () => {
  it('renders author name and link correctly', () => {
    render(<ImageAttribution {...mockImageAttributionProps} />);
    const link = screen.getByTestId('FruitImageAuthor');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent(mockImageAttributionProps.author.name);
    expect(link.getAttribute('href')).toBe(mockImageAttributionProps.author.url);
  });
});
