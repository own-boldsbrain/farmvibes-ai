import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import InternalLink from './InternalLink';
import { mockInternalLinkProps } from './InternalLink.mock';

describe('<InternalLink />', () => {
  it('renders correctly preserving search parameters and hash state', () => {
    render(
      <MemoryRouter initialEntries={['/source?param=value#myhash']}>
        <InternalLink {...mockInternalLinkProps} />
      </MemoryRouter>
    );
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toBe('/target-route?param=value#myhash');
  });
});
