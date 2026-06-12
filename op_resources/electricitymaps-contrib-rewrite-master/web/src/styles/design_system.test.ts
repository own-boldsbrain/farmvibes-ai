import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ThemeManager } from './gerenciador_de_temas';
import { LightTheme, DarkTheme, ZincScale } from './tokens_de_design';
import { LayoutGrid } from './sistema_de_grelha_e_layout';

describe('Design System: The Precision Architect', () => {
  describe('ThemeManager', () => {
    let themeManager: ThemeManager;

    beforeEach(() => {
      themeManager = new ThemeManager('light');
      // Mock document and documentElement
      const mockRoot = {
        setAttribute: vi.fn(),
        style: {
          setProperty: vi.fn(),
        },
      };
      vi.stubGlobal('document', {
        documentElement: mockRoot,
      });
    });

    it('should initialize with LightTheme', () => {
      expect(themeManager.getTheme()).toEqual(LightTheme);
    });

    it('should toggle between Light and Dark themes', () => {
      const theme1 = themeManager.toggleTheme();
      expect(theme1).toEqual(DarkTheme);
      expect(theme1.isDark).toBe(true);

      const theme2 = themeManager.toggleTheme();
      expect(theme2).toEqual(LightTheme);
      expect(theme2.isDark).toBe(false);
    });

    it('should apply theme variables to DOM', () => {
      themeManager.applyToDOM();
      
      const root = document.documentElement;
      expect(root.setAttribute).toHaveBeenCalledWith('data-theme', LightTheme.name);
      expect(root.style.setProperty).toHaveBeenCalledWith('--color-bg', LightTheme.colors.background);
      expect(root.style.setProperty).toHaveBeenCalledWith('--border-radius', '0px');
    });
  });

  describe('LayoutGrid', () => {
    const grid = new LayoutGrid();

    it('should calculate modular spacing', () => {
      expect(grid.space(1)).toBe('8px');
      expect(grid.space(2)).toBe('16px');
    });

    it('should calculate asymmetric split for 1200px container', () => {
      // 12 cols, 16px gap, 24px margin
      // Total gaps = 11 * 16 = 176
      // Margins = 2 * 24 = 48
      // Available = 1200 - 176 - 48 = 976
      // Single col = 976 / 12 = 81.33...
      // Sidebar (3 cols) = 3 * 81.33 + 2 * 16 = 244 + 32 = 276
      // Content (9 cols) = 9 * 81.33 + 8 * 16 = 732 + 128 = 860
      // 276 + 860 + 16 + 48 = 1200. Correct.
      
      const split = grid.calculateAsymmetricSplit(1200);
      expect(split.sidebarWidth).toBe(276);
      expect(split.mainContentWidth).toBe(860);
      expect(split.gap).toBe(16);
    });

    it('should snap values to 8px baseline', () => {
      expect(grid.snapToBaseline(7)).toBe(8);
      expect(grid.snapToBaseline(8)).toBe(8);
      expect(grid.snapToBaseline(9)).toBe(16);
    });
  });
});
