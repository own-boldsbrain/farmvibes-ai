import { DesignTheme, LightTheme, DarkTheme, KineticGradient } from './tokens_de_design';

/**
 * UTILS DE RUNTIME DO DESIGN SYSTEM
 * * Fornece ferramentas para injetar variáveis CSS diretamente no DOM,
 * respeitando os princípios de diagramação industrial e ausência de linhas.
 */

export class ThemeManager {
  private currentTheme: DesignTheme;

  constructor(initialTheme: 'light' | 'dark' = 'light') {
    this.currentTheme = initialTheme === 'light' ? LightTheme : DarkTheme;
  }

  /**
   * Retorna o tema ativo atualmente
   */
  public getTheme(): DesignTheme {
    return this.currentTheme;
  }

  /**
   * Alterna entre Light (The Precision Architect) e Dark (The Void)
   */
  public toggleTheme(): DesignTheme {
    this.currentTheme = this.currentTheme.isDark ? LightTheme : DarkTheme;
    this.applyToDOM();
    return this.currentTheme;
  }

  /**
   * Converte a especificação do Gradiente Cinético em uma string CSS inline utilizável
   */
  public getKineticGradientCSS(angleDegrees: number = 90): string {
    return `linear-gradient(${angleDegrees}deg, ${KineticGradient.Stop1} 0%, ${KineticGradient.Stop2} 50%, ${KineticGradient.Stop3} 100%)`;
  }

  /**
   * Injeta os tokens na raiz do DOM através de variáveis CSS.
   * Útil para integrar com frameworks como Tailwind CSS.
   */
  public applyToDOM(): void {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const { colors, layout, name } = this.currentTheme;

    // Injeção de Meta-Atributos de Depuração
    root.setAttribute('data-theme', name);
    root.setAttribute('style', ''); // Reseta estilos injetados anteriormente

    // Definição das Variáveis CSS de Cores
    root.style.setProperty('--color-bg', colors.background);
    root.style.setProperty('--color-text-primary', colors.textPrimary);
    root.style.setProperty('--color-text-secondary', colors.textSecondary);
    root.style.setProperty('--color-accent-primary', colors.accentPrimary);
    root.style.setProperty('--color-accent-secondary', colors.accentSecondary);
    root.style.setProperty('--color-accent-tertiary', colors.accentTertiary);

    // Variáveis Estritas de Elevação Tonal (Zero Shadows)
    root.style.setProperty('--elevation-surface', colors.elevation.surface);
    root.style.setProperty('--elevation-low', colors.elevation.containerLow);
    root.style.setProperty('--elevation-high', colors.elevation.containerHigh);
    root.style.setProperty('--elevation-elevated', colors.elevation.containerElevated);

    // Bordas de Fantasma e Layout Ortogonal
    root.style.setProperty('--border-radius', layout.borderRadius);
    root.style.setProperty('--spacing-unit', layout.spacingUnit);
    root.style.setProperty('--ghost-border-color', colors.ghostBorderColor);

    // Gradiente Cinético Assinado
    root.style.setProperty('--kinetic-gradient', this.getKineticGradientCSS());
  }
}

/**
 * Exemplo de mapeamento para configuração rápida do Tailwind CSS:
 * * module.exports = {
 * theme: {
 * extend: {
 * colors: {
 * bg: 'var(--color-bg)',
 * textPrimary: 'var(--color-text-primary)',
 * textSecondary: 'var(--color-text-secondary)',
 * surface: 'var(--elevation-surface)',
 * 'container-low': 'var(--elevation-low)',
 * 'container-high': 'var(--elevation-high)',
 * 'container-elevated': 'var(--elevation-elevated)',
 * },
 * backgroundImage: {
 * 'kinetic-gradient': 'var(--kinetic-gradient)',
 * },
 * borderRadius: {
 * none: '0px', // Strict industrial priority
 * }
 * }
 * }
 * }
 */