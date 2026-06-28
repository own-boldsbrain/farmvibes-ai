import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AnalyticsLayout from './AnalyticsLayout';

// Mock lucide-react icons to avoid rendering issues in JSDOM
vi.mock('lucide-react', () => ({
  Zap: () => <span data-testid="icon-zap" />,
  Terminal: () => <span data-testid="icon-terminal" />,
  Database: () => <span data-testid="icon-database" />,
  Map: () => <span data-testid="icon-map" />,
}));

function renderWithRouter(activeView: 'macro' | 'duck-curve' | 'bialek' | 'ai-terminal') {
  return render(
    <MemoryRouter>
      <AnalyticsLayout activeView={activeView}>
        <div data-testid="child-content">Test Content</div>
      </AnalyticsLayout>
    </MemoryRouter>
  );
}

describe('AnalyticsLayout', () => {
  it('should render children in the main content area', () => {
    renderWithRouter('macro');
    expect(screen.getByTestId('child-content')).toBeDefined();
    expect(screen.getByText('Test Content')).toBeDefined();
  });

  it('should render the Grid Analytics Engine header', () => {
    renderWithRouter('macro');
    expect(screen.getByText('Grid Analytics Engine')).toBeDefined();
  });

  it('should render the system identifier tag', () => {
    renderWithRouter('macro');
    expect(screen.getByText('BR-SIN-2026')).toBeDefined();
  });

  it('should render all navigation buttons', () => {
    renderWithRouter('macro');
    expect(screen.getByText('Ver Mapa')).toBeDefined();
    expect(screen.getByText('Europa vs Brasil')).toBeDefined();
    expect(screen.getByText('Duck Curve (MMGD)')).toBeDefined();
    expect(screen.getByText('Matriz de Bialek')).toBeDefined();
    expect(screen.getByText('Co-Piloto IA')).toBeDefined();
  });

  it('should highlight the active view button with font-black', () => {
    const { container } = renderWithRouter('duck-curve');
    const duckCurveButton = screen.getByText('Duck Curve (MMGD)');
    expect(duckCurveButton.className).toContain('font-black');
  });

  it('should render the sidebar with mathematical formulas', () => {
    renderWithRouter('macro');
    expect(screen.getByText('Motor Matemático')).toBeDefined();
    expect(screen.getByText('C = A_u⁻¹ * B')).toBeDefined();
  });

  it('should render the telemetry layers section', () => {
    renderWithRouter('macro');
    expect(screen.getByText('Camadas de Telemetria')).toBeDefined();
    expect(screen.getByText('Tier A (Medida)')).toBeDefined();
    expect(screen.getByText('Tier B (Estimada)')).toBeDefined();
    expect(screen.getByText('Tier C (Sintética)')).toBeDefined();
  });

  it('should render the data source status indicator', () => {
    renderWithRouter('macro');
    expect(screen.getByText('MCTI / SIRENE')).toBeDefined();
    expect(screen.getByText('ONLINE')).toBeDefined();
  });
});
