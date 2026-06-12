/**
 * SISTEMA MATEMÁTICO DE GRELHAS - THE PRECISION ARCHITECT
 * * Fornece ferramentas de engenharia para calcular layouts assimétricos,
 * assegurar baseline grid estrito e posicionamento modular.
 */

export interface GridConfig {
  columns: number;
  gapPx: number;
  marginPx: number;
  baselinePx: number; // Linha de base para ancoragem de texto (padrão: 8px)
}

export const StrictGridConfig: GridConfig = {
  columns: 12,
  gapPx: 16,
  marginPx: 24,
  baselinePx: 8,
};

export class LayoutGrid {
  private config: GridConfig;

  constructor(config: GridConfig = StrictGridConfig) {
    this.config = config;
  }

  /**
   * Calcula o espaçamento modular baseado no multiplicador da unidade
   */
  public space(multiplier: number): string {
    return `${multiplier * this.config.baselinePx}px`;
  }

  /**
   * Calcula a grelha assimétrica (Left-Weighted Layout)
   * Útil para manter sidebars pesadas flutuantes alinhadas à esquerda
   * @param containerWidth Largura total em pixels do chassis
   * @returns Mapeamento das colunas calculadas
   */
  public calculateAsymmetricSplit(containerWidth: number): {
    sidebarWidth: number;
    mainContentWidth: number;
    gap: number;
  } {
    const totalGaps = this.config.columns - 1;
    const availableWidth = containerWidth - (this.config.marginPx * 2) - (totalGaps * this.config.gapPx);
    const singleColumnWidth = availableWidth / this.config.columns;

    // Sidebar estrita de 3 colunas, conteúdo principal de 9 colunas (Assimetria Editorial)
    const sidebarCols = 3;
    const mainCols = 9;

    const sidebarWidth = (sidebarCols * singleColumnWidth) + ((sidebarCols - 1) * this.config.gapPx);
    const mainContentWidth = (mainCols * singleColumnWidth) + ((mainCols - 1) * this.config.gapPx);

    return {
      sidebarWidth: Math.round(sidebarWidth),
      mainContentWidth: Math.round(mainContentWidth),
      gap: this.config.gapPx
    };
  }

  /**
   * Força qualquer valor de altura ou margem a alinhar perfeitamente com a Linha de Base (Baseline Grid)
   * Mantém o aspeto técnico rígido (Industrial Blueprint)
   */
  public snapToBaseline(valuePx: number): number {
    const remainder = valuePx % this.config.baselinePx;
    if (remainder === 0) return valuePx;
    
    // Arredonda para a unidade de linha de base mais próxima
    return valuePx + (this.config.baselinePx - remainder);
  }

  /**
   * Retorna os estilos CSS inline recomendados para uma div de coluna assimétrica
   */
  public getAsymmetricStyles(containerWidth: number): {
    sidebar: Record<string, string>;
    content: Record<string, string>;
  } {
    const dimensions = this.calculateAsymmetricSplit(containerWidth);
    return {
      sidebar: {
        width: `${dimensions.sidebarWidth}px`,
        marginRight: `${dimensions.gap}px`,
        flexShrink: '0',
      },
      content: {
        width: `${dimensions.mainContentWidth}px`,
        flexGrow: '1',
      }
    };
  }
}