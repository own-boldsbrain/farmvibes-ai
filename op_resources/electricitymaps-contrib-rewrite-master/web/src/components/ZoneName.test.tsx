import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ZoneName } from './ZoneName';
import { mockZoneNameUS, mockZoneNameBR } from './ZoneName.mock';

// Mock translation helpers to avoid external file dependencies
vi.mock('../translation/translation', () => ({
  getShortenedZoneNameWithCountry: (zone: string) => `Mocked Name (${zone})`,
  useTranslation: () => ({
    __: (key: string) => key,
  }),
}));

describe('<ZoneName />', () => {
  it('renders zone name and flag correctly', () => {
    render(<ZoneName {...mockZoneNameUS} />);
    expect(screen.getByText('Mocked Name (US)')).toBeInTheDocument();
  });

  it('renders with custom textStyle classes correctly', () => {
    render(<ZoneName {...mockZoneNameBR} />);
    const textElement = screen.getByText('Mocked Name (BR-SP)');
    expect(textElement.className).toContain('text-red-500');
    expect(textElement.className).toContain('font-bold');
  });
});
