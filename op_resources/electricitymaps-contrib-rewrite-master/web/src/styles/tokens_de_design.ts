/**
 * ESPECIFICAÇÃO DE DESIGN SYSTEM: THE PRECISION ARCHITECT (LIGHT & DARK)
 * Versão: 1.0.0
 * * Este arquivo define a fundação estrita e matemática dos tokens industriais.
 * Seguindo a premissa de "Zero-Line Integrity", as interfaces não usam bordas de 1px.
 * O espaço e a profundidade são estabelecidos através do empilhamento de planos tonais.
 */

// --- 1. PRIMITIVAS DE CORES (ESPECTRO ZINC & GRADIENTES DE ALTA PRECISÃO) ---

export const ZincScale = {
  Zinc50: '#F9F9FB',   // Superfície Base (Claro)
  Zinc100: '#F1F1F4',  // Contentor Baixo (Claro)
  Zinc200: '#E4E4E7',  // Contentor Alto (Claro)
  Zinc300: '#D4D4D8',  // Contraste Suave
  Zinc400: '#A1A1AA',  // Metadados Secundários (Escuro)
  Zinc500: '#71717A',  // Rótulos e Informações de Engenharia
  Zinc800: '#27272A',  // Contentor Alto (Escuro)
  Zinc900: '#18181B',  // Contentor Baixo (Escuro) / Texto Claro
  Zinc950: '#09090B',  // Superfície Base (Escuro) / Texto Escuro
} as const;

export const KineticGradient = {
  Stop1: '#FFCE00', // Secondary / Safety Gold
  Stop2: '#FF6600', // Primary / Deep Orange
  Stop3: '#FF0066', // Tertiary / Vivid Magenta
} as const;

// --- 2. CONFIGURAÇÕES TIPOGRÁFICAS (THE EDITORIAL BLUEPRINT) ---

export interface TypographyRole {
  fontFamily: string;
  fontSize: string;
  fontWeight: '400' | '500' | '600' | '700';
  letterSpacing: string;
  lineHeight: string;
  textTransform?: 'uppercase' | 'none';
}

export const Typography = {
  fontFamily: 'Inter, -apple-system, sans-serif',
  
  DisplayLG: {
    fontFamily: 'Inter, -apple-system, sans-serif',
    fontSize: '3.5rem',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '1.1', // "Tight" line height
  } as TypographyRole,

  HeadlineSM: {
    fontFamily: 'Inter, -apple-system, sans-serif',
    fontSize: '1.5rem',
    fontWeight: '600',
    letterSpacing: '-0.01em',
    lineHeight: '1.2',
  } as TypographyRole,

  BodyMD: {
    fontFamily: 'Inter, -apple-system, sans-serif',
    fontSize: '0.875rem',
    fontWeight: '400',
    letterSpacing: 'normal',
    lineHeight: '1.5',
  } as TypographyRole,

  LabelSM: {
    fontFamily: 'Inter, -apple-system, sans-serif',
    fontSize: '0.6875rem',
    fontWeight: '500',
    letterSpacing: '0.05em', // Espaçamento industrial (blueprint style)
    lineHeight: '1.3',
    textTransform: 'uppercase',
  } as TypographyRole,
} as const;

// --- 3. DEFINIÇÕES DE ELEVAÇÃO (MUDANÇA DE COR, NÃO SOMBRA) ---

export interface ElevationTheme {
  surface: string;            // Nível Base
  containerLow: string;       // Nível de Recesso (Utilidades / Sidebars)
  containerHigh: string;      // Nível Profundo de Contraste / Divisões de Background
  containerElevated: string;  // Nível Máximo de Elevação (Cartões e Modais)
}

// --- 4. CONFIGURAÇÕES COMPLEMENTARES DE ACESSIBILIDADE ---

export const GhostBorder = {
  stroke: '1px solid',
  color: '#E3BFB1',
  opacity: 0.15, // Apenas para extrema necessidade de contraste
} as const;

// --- 5. COMPILAÇÃO DO TEMA COMPLETO ---

export interface DesignTheme {
  name: 'The Precision Architect' | 'The Void';
  isDark: boolean;
  colors: {
    background: string;
    textPrimary: string;
    textSecondary: string;
    accentPrimary: string;
    accentSecondary: string;
    accentTertiary: string;
    elevation: ElevationTheme;
    ghostBorderColor: string;
  };
  typography: typeof Typography;
  layout: {
    borderRadius: '0px'; // Strict Square Rule
    spacingUnit: string;
  };
}

export const LightTheme: DesignTheme = {
  name: 'The Precision Architect',
  isDark: false,
  colors: {
    background: ZincScale.Zinc50,
    textPrimary: ZincScale.Zinc950,
    textSecondary: ZincScale.Zinc500,
    accentPrimary: KineticGradient.Stop2,
    accentSecondary: KineticGradient.Stop1,
    accentTertiary: KineticGradient.Stop3,
    elevation: {
      surface: ZincScale.Zinc50,       // #F9F9FB
      containerLow: ZincScale.Zinc100,  // #F1F1F4
      containerHigh: ZincScale.Zinc200, // #E4E4E7
      containerElevated: '#FFFFFF',     // Elevação pura baseada em contraste (+2% brilho)
    },
    ghostBorderColor: '#E3BFB1',
  },
  typography: Typography,
  layout: {
    borderRadius: '0px',
    spacingUnit: '8px',
  },
};

export const DarkTheme: DesignTheme = {
  name: 'The Void',
  isDark: true,
  colors: {
    background: ZincScale.Zinc950,
    textPrimary: ZincScale.Zinc50,
    textSecondary: ZincScale.Zinc400,
    accentPrimary: KineticGradient.Stop2,
    accentSecondary: KineticGradient.Stop1,
    accentTertiary: KineticGradient.Stop3,
    elevation: {
      surface: ZincScale.Zinc950,       // #09090B
      containerLow: ZincScale.Zinc900,  // #18181B
      containerHigh: ZincScale.Zinc800, // #27272A
      containerElevated: '#1E1E21',     // Contraste invertido na escuridão
    },
    ghostBorderColor: '#5C443C',
  },
  typography: Typography,
  layout: {
    borderRadius: '0px',
    spacingUnit: '8px',
  },
};