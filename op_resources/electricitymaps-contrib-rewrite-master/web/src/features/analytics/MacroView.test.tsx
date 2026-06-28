import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { mockMacroViewProps } from './MacroView.mock';
import MacroView from './MacroView';

vi.mock('lucide-react', () => ({
  Globe: () => <span data-testid="icon-globe" />,
}));

describe('MacroView', () => {
  it('should render the page heading', () => {
    render(<MacroView {...mockMacroViewProps} />);
    expect(screen.getByText('O Paradigma do Efeito "Ordem de Mérito"')).toBeDefined();
  });

  it('should render the context label', () => {
    render(<MacroView {...mockMacroViewProps} />);
    expect(screen.getByText('Contexto Macro')).toBeDefined();
  });

  it('should render all regions in the comparative table', () => {
    render(<MacroView {...mockMacroViewProps} />);
    expect(screen.getByText('Holanda')).toBeDefined();
    expect(screen.getByText('Alemanha')).toBeDefined();
    expect(screen.getByText('Espanha')).toBeDefined();
    expect(screen.getByText('Bélgica')).toBeDefined();
    expect(screen.getByText('França')).toBeDefined();
    expect(screen.getByText('Brasil (SIN)')).toBeDefined();
  });

  it('should render the table header columns', () => {
    render(<MacroView {...mockMacroViewProps} />);
    expect(screen.getByText('Região')).toBeDefined();
    expect(screen.getByText('Preço Médio')).toBeDefined();
    expect(screen.getByText('Corr. Preço-Carbono')).toBeDefined();
    expect(screen.getByText('Horas Negativas')).toBeDefined();
    expect(screen.getByText('Pegada de Carbono')).toBeDefined();
  });

  it('should render the Brazilian anomaly section', () => {
    render(<MacroView {...mockMacroViewProps} />);
    expect(screen.getByText('A Anomalia Brasileira')).toBeDefined();
  });

  it('should render the MCTI emission factor', () => {
    render(<MacroView {...mockMacroViewProps} />);
    expect(screen.getByText('21,5')).toBeDefined();
    expect(screen.getByText('gCO₂eq/kWh')).toBeDefined();
  });

  it('should render the year label for the comparison table', () => {
    render(<MacroView {...mockMacroViewProps} />);
    expect(screen.getByText('Tabela Comparativa Global (2025)')).toBeDefined();
  });
});
