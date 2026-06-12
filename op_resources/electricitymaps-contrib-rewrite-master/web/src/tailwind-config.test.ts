import { describe, it, expect } from 'vitest';
import config from '../tailwind.config.js';

describe('Tailwind Configuration', () => {
  it('should have the correct Precision Architect colors using CSS variables', () => {
    const colors = config.theme.extend.colors;
    
    expect(colors['bg']).toBe('var(--color-bg)');
    expect(colors['precision-surface']).toBe('var(--elevation-surface)');
    expect(colors['precision-low']).toBe('var(--elevation-low)');
    expect(colors['precision-high']).toBe('var(--elevation-high)');
    expect(colors['precision-elevated']).toBe('var(--elevation-elevated)');
    
    expect(colors['precision-text-primary']).toBe('var(--color-text-primary)');
    expect(colors['precision-text-secondary']).toBe('var(--color-text-secondary)');
  });

  it('should have the ysh-kinetic gradient using CSS variable', () => {
    const bgImage = config.theme.extend.backgroundImage;
    expect(bgImage['ysh-kinetic']).toContain('var(--kinetic-gradient');
  });

  it('should have orthogonal border radius (0px)', () => {
    const borderRadius = config.theme.extend.borderRadius;
    Object.values(borderRadius).forEach(value => {
      expect(value).toBe('0px');
    });
  });
});
