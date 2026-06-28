import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { mockBialekViewProps } from './BialekView.mock';
import BialekView from './BialekView';

vi.mock('lucide-react', () => ({
  Map: () => <span data-testid="icon-map" />,
  ShieldAlert: () => <span data-testid="icon-shield" />,
}));

describe('BialekView', () => {
  it('should render the page heading', () => {
    render(<BialekView {...mockBialekViewProps} />);
    expect(screen.getByText('Matriz de Compartilhamento de Bialek')).toBeDefined();
  });

  it('should render the topological tracking label', () => {
    render(<BialekView {...mockBialekViewProps} />);
    expect(screen.getByText('Rastreamento Topológico')).toBeDefined();
  });

  it('should render all four submarket cards', () => {
    render(<BialekView {...mockBialekViewProps} />);
    expect(screen.getByText('Sudeste / Centro-Oeste')).toBeDefined();
    expect(screen.getByText('Sul')).toBeDefined();
    expect(screen.getByText('Nordeste')).toBeDefined();
    expect(screen.getByText('Norte')).toBeDefined();
  });

  it('should render the submarket IDs', () => {
    render(<BialekView {...mockBialekViewProps} />);
    expect(screen.getByText('SE/CO')).toBeDefined();
    expect(screen.getByText('SUL')).toBeDefined();
    expect(screen.getByText('NE')).toBeDefined();
    expect(screen.getByText('NORTE')).toBeDefined();
  });

  it('should display states for each submarket', () => {
    render(<BialekView {...mockBialekViewProps} />);
    expect(screen.getByText('SP, RJ, MG, ES, GO, MT, MS, DF')).toBeDefined();
    expect(screen.getByText('PR, SC, RS')).toBeDefined();
  });

  it('should display the dominant energy source for each submarket', () => {
    render(<BialekView {...mockBialekViewProps} />);
    expect(screen.getByText('Hidro, Biomassa, Gás')).toBeDefined();
    expect(screen.getByText('Hidro, Eólica, Carvão')).toBeDefined();
    expect(screen.getByText('Eólica, Solar')).toBeDefined();
    expect(screen.getByText('Hidro, Fóssil')).toBeDefined();
  });

  it('should display flow type for each submarket', () => {
    render(<BialekView {...mockBialekViewProps} />);
    expect(screen.getByText('Importador / Balanço')).toBeDefined();
    expect(screen.getByText('Sazonal')).toBeDefined();
    expect(screen.getByText('Exportador Líquido')).toBeDefined();
    expect(screen.getByText('Exportador Sazonal')).toBeDefined();
  });

  it('should render the network loss compensation note', () => {
    render(<BialekView {...mockBialekViewProps} />);
    expect(screen.getByText('Compensação de Perdas na Rede')).toBeDefined();
  });
});
