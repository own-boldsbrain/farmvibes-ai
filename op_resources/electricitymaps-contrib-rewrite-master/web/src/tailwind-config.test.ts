import { describe, it, expect } from 'vitest';
import config from '../tailwind.config.js';

describe('Tailwind Configuration', () => {
  it('should have the correct Precision Architect colors using CSS variables', () => {
    const colors = config.theme.extend.colors;

    expect(colors['bg']).toBe('var(--color-bg)');
    expect(colors['surface']).toBe('var(--elevation-surface)');
    expect(colors['container-low']).toBe('var(--elevation-low)');
    expect(colors['container-high']).toBe('var(--elevation-high)');
    expect(colors['container-elevated']).toBe('var(--elevation-elevated)');

    expect(colors['textPrimary']).toBe('var(--color-text-primary)');
    expect(colors['textSecondary']).toBe('var(--color-text-secondary)');
  });

  it('should have the kinetic gradient using CSS variable', () => {
    const bgImage = config.theme.extend.backgroundImage;
    expect(bgImage['kinetic-gradient']).toContain('var(--kinetic-gradient');
  });

  it('should have orthogonal border radius (0px)', () => {
    const borderRadius = config.theme.extend.borderRadius;
    Object.values(borderRadius).forEach(value => {
      expect(value).toBe('0px');
    });
  });

  it('should have the Kinetic accent palette defined', () => {
    const accent = config.theme.extend.colors.accent;
    expect(accent.gold).toBe('#FFCE00');
    expect(accent.orange).toBe('#FF6600');
    expect(accent.magenta).toBe('#FF0066');
  });
});
