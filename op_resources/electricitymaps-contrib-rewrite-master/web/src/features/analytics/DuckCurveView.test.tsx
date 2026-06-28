import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { mockDuckCurveViewProps } from './DuckCurveView.mock';
import DuckCurveView from './DuckCurveView';

vi.mock('lucide-react', () => ({
  Sun: () => <span data-testid="icon-sun" />,
  RefreshCw: () => <span data-testid="icon-refresh" />,
  Sparkles: () => <span data-testid="icon-sparkles" />,
  TrendingDown: () => <span data-testid="icon-trending" />,
}));

describe('DuckCurveView', () => {
  it('should render the page heading', () => {
    render(<DuckCurveView {...mockDuckCurveViewProps} />);
    expect(screen.getByText('O Efeito MMGD e a "Curva do Pato"')).toBeDefined();
  });

  it('should render the load dynamics label', () => {
    render(<DuckCurveView {...mockDuckCurveViewProps} />);
    expect(screen.getByText('Dinâmica de Carga')).toBeDefined();
  });

  it('should render the MMGD solar injection section', () => {
    render(<DuckCurveView {...mockDuckCurveViewProps} />);
    expect(screen.getByText('Injeção Solar MMGD')).toBeDefined();
  });

  it('should display the default MMGD capacity value', () => {
    render(<DuckCurveView {...mockDuckCurveViewProps} />);
    // Default mmgdCapacity from state is 9.0
    expect(screen.getByText('9.0')).toBeDefined();
  });

  it('should render the slider input', () => {
    const { container } = render(<DuckCurveView {...mockDuckCurveViewProps} />);
    const slider = container.querySelector('input[type="range"]');
    expect(slider).toBeDefined();
    expect(slider?.getAttribute('min')).toBe('0');
    expect(slider?.getAttribute('max')).toBe('30');
  });

  it('should display the computed net midday load', () => {
    render(<DuckCurveView {...mockDuckCurveViewProps} />);
    // With default 9.0 GW: netMiddayLoad = 78.0 - 9.0 = 69.0
    expect(screen.getByText('69.0 GW')).toBeDefined();
  });

  it('should display the evening ramp rate', () => {
    render(<DuckCurveView {...mockDuckCurveViewProps} />);
    // rampRate = 85.0 - 69.0 = 16.0
    expect(screen.getByText('16.0 GW')).toBeDefined();
  });

  it('should render the AI report generation button', () => {
    render(<DuckCurveView {...mockDuckCurveViewProps} />);
    expect(screen.getByText('Gerar Relatório de Impacto IA')).toBeDefined();
  });

  it('should render the time labels for the visualization', () => {
    render(<DuckCurveView {...mockDuckCurveViewProps} />);
    expect(screen.getByText('12:00')).toBeDefined();
    expect(screen.getByText('18:00')).toBeDefined();
  });

  it('should render the abstract load profile title', () => {
    render(<DuckCurveView {...mockDuckCurveViewProps} />);
    expect(screen.getByText('Perfil Abstrato de Carga (Meio-dia vs Anoitecer)')).toBeDefined();
  });
});
