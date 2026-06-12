import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap,
  Terminal,
  Database,
  Map
} from 'lucide-react';

interface AnalyticsLayoutProps {
  activeView: 'macro' | 'duck-curve' | 'bialek' | 'ai-terminal';
  children: React.ReactNode;
}

export default function AnalyticsLayout({ activeView, children }: AnalyticsLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg text-textPrimary flex items-center justify-center p-0 md:p-6 font-sans select-none overflow-hidden h-screen relative">
      
      {/* CHASSIS THE PRECISION ARCHITECT / THE VOID (Zero Lines, 0px Radius) */}
      <div className="w-full h-screen md:h-[95vh] md:max-w-7xl bg-surface flex flex-col relative overflow-hidden shadow-none border border-bg">
        
        {/* Top Telemetry Strip */}
        <div className="bg-container-low p-3 flex justify-between items-center z-30 border-b border-bg">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-kinetic-gradient flex items-center justify-center">
              <Zap className="w-3 h-3 text-textPrimary" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[0.6875rem] font-bold tracking-[0.05em] uppercase text-textPrimary">Grid Analytics Engine</span>
              <span className="text-[9px] bg-container-high text-textPrimary font-mono px-2 py-0.5 font-bold">BR-SIN-2026</span>
            </div>
          </div>
          
          <div className="flex gap-1 bg-container-high p-1">
            <button 
              onClick={() => navigate('/map')}
              className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-none transition-all text-textSecondary hover:bg-surface flex items-center gap-1"
            >
              <Map className="w-3.5 h-3.5" />
              Ver Mapa
            </button>
            <button 
              onClick={() => navigate('/macro')}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-none transition-all ${activeView === 'macro' ? 'bg-bg text-textPrimary font-black' : 'text-textSecondary hover:bg-surface'}`}
            >
              Europa vs Brasil
            </button>
            <button 
              onClick={() => navigate('/duck-curve')}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-none transition-all ${activeView === 'duck-curve' ? 'bg-bg text-textPrimary font-black' : 'text-textSecondary hover:bg-surface'}`}
            >
              Duck Curve (MMGD)
            </button>
            <button 
              onClick={() => navigate('/bialek')}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-none transition-all ${activeView === 'bialek' ? 'bg-bg text-textPrimary font-black' : 'text-textSecondary hover:bg-surface'}`}
            >
              Matriz de Bialek
            </button>
            <button 
              onClick={() => navigate('/ai-terminal')}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-none transition-all flex items-center gap-1 ${activeView === 'ai-terminal' ? 'bg-kinetic-gradient text-textPrimary font-black' : 'text-accent-orange hover:bg-surface'}`}
            >
              Co-Piloto IA
            </button>
          </div>
        </div>

        {/* Layout Assimétrico */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* BARRA LATERAL (Painel Analítico) */}
          <aside className="hidden md:flex w-[320px] bg-container-low flex-col justify-between shrink-0 p-4 gap-4 z-20 border-r border-bg">
            
            <div className="space-y-4">
              <div className="bg-surface p-4 space-y-2 rounded-none border border-bg">
                <span className="text-[9px] font-bold uppercase text-textSecondary tracking-wider block">Relatório Executivo</span>
                <h2 className="text-sm font-bold text-textPrimary leading-tight">Rastreamento de Fluxo e Preço de Carbono</h2>
                <p className="text-[10px] text-textSecondary font-mono leading-relaxed">
                  Traduzindo os paradigmas do "Merit Order Effect" europeu para a matriz renovável do SIN Brasileiro (2025-2026).
                </p>
              </div>

              {/* Equações */}
              <div className="bg-bg p-4 text-textPrimary font-mono text-[10px] space-y-4 rounded-none border border-bg">
                <div className="flex items-center gap-2 text-accent-gold">
                  <Terminal className="w-4 h-4" />
                  <span className="font-bold tracking-widest uppercase">Motor Matemático</span>
                </div>
                
                <div className="space-y-1.5 border-l-2 border-textSecondary pl-3">
                  <span className="text-textSecondary text-[8px] uppercase">Conservação de Massa (Nó i)</span>
                  <p>C_i * P_i = Σ(C_j * P_ji) + EF_i * G_i</p>
                </div>
                
                <div className="space-y-1.5 border-l-2 border-accent-orange pl-3">
                  <span className="text-textSecondary text-[8px] uppercase">Equação Nodal Normalizada</span>
                  <p>C_i - Σ(C_j * P_ji/P_i) = EF_i * G_i/P_i</p>
                </div>

                <div className="space-y-1.5 border-l-2 border-accent-magenta pl-3 bg-surface/5 p-2">
                  <span className="text-textSecondary text-[8px] uppercase">Solução Matricial (Bialek)</span>
                  <p className="text-accent-orange font-bold text-xs">C = A_u⁻¹ * B</p>
                </div>
              </div>

              {/* Níveis de Ingestão de Dados */}
              <div className="bg-surface p-4 space-y-3 rounded-none border border-bg">
                <span className="text-[9px] font-bold uppercase text-textSecondary tracking-wider block">Camadas de Telemetria</span>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] border-b border-bg pb-1">
                    <span className="font-bold text-textPrimary">Tier A (Medida)</span>
                    <span className="font-mono text-accent-orange">ONS / CCEE</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] border-b border-bg pb-1">
                    <span className="font-bold text-textPrimary">Tier B (Estimada)</span>
                    <span className="font-mono text-accent-gold">MMGD Solar</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-textPrimary">Tier C (Sintética)</span>
                    <span className="font-mono text-textSecondary">Sist. Isolados</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface p-3 flex items-center justify-between rounded-none border border-bg">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-accent-orange" />
                <div>
                  <h4 className="text-[11px] font-bold text-textPrimary leading-none">MCTI / SIRENE</h4>
                  <p className="text-[9px] text-textSecondary font-mono mt-0.5">Base Atualizada</p>
                </div>
              </div>
              <span className="text-[8px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 font-bold font-mono">ONLINE</span>
            </div>

          </aside>

          {/* ÁREA DE VISUALIZAÇÃO PRINCIPAL */}
          <main className="flex-1 bg-bg overflow-y-auto p-4 md:p-8 relative">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
