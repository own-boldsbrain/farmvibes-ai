import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { mockAiTerminalViewProps } from './AiTerminalView.mock';
import AiTerminalView from './AiTerminalView';

vi.mock('lucide-react', () => ({
  Send: () => <span data-testid="icon-send" />,
  RefreshCw: () => <span data-testid="icon-refresh" />,
  Sparkles: () => <span data-testid="icon-sparkles" />,
  BookOpen: () => <span data-testid="icon-book" />,
  ExternalLink: () => <span data-testid="icon-external" />,
}));

describe('AiTerminalView', () => {
  it('should render the page heading', () => {
    render(<AiTerminalView {...mockAiTerminalViewProps} />);
    expect(screen.getByText('Co-Piloto de Carbono & Regulação')).toBeDefined();
  });

  it('should render the audit label', () => {
    render(<AiTerminalView {...mockAiTerminalViewProps} />);
    expect(screen.getByText('Auditoria Digital')).toBeDefined();
  });

  it('should render the Gemini model reference', () => {
    render(<AiTerminalView {...mockAiTerminalViewProps} />);
    expect(screen.getByText('gemini-3-flash-preview')).toBeDefined();
  });

  it('should render the Google Grounding toggle', () => {
    render(<AiTerminalView {...mockAiTerminalViewProps} />);
    expect(screen.getByText('Google Grounding')).toBeDefined();
  });

  it('should render the initial system message in terminal history', () => {
    render(<AiTerminalView {...mockAiTerminalViewProps} />);
    expect(screen.getByText(/Sistema de IA Gemini Online/)).toBeDefined();
  });

  it('should render the prompt input field', () => {
    const { container } = render(<AiTerminalView {...mockAiTerminalViewProps} />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toBeDefined();
    expect(input?.getAttribute('placeholder')).toContain('Faça uma consulta');
  });

  it('should render the submit button', () => {
    render(<AiTerminalView {...mockAiTerminalViewProps} />);
    expect(screen.getByText('Submeter')).toBeDefined();
  });

  it('should render all three suggested prompt buttons', () => {
    render(<AiTerminalView {...mockAiTerminalViewProps} />);
    expect(screen.getByText('MCTI / SIRENE')).toBeDefined();
    expect(screen.getByText('Bialek & Perdas')).toBeDefined();
    expect(screen.getByText('ANEEL REN 1000/2021')).toBeDefined();
  });

  it('should render the regulatory test cases section label', () => {
    render(<AiTerminalView {...mockAiTerminalViewProps} />);
    expect(screen.getByText('Fórmulas e Casos de Teste Regulamentares')).toBeDefined();
  });
});
