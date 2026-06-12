import React from 'react';
import { useAtom } from 'jotai';
import { Sun, RefreshCw, Sparkles, TrendingDown } from 'lucide-react';
import { 
  mmgdCapacityAtom, 
  activeScenarioReportAtom, 
  isScenarioReportGeneratingAtom 
} from './state';

// Helper function for exponential backoff for Gemini API
const fetchWithRetry = async (url: string, options: any, retries = 4, delay = 1000): Promise<Response> => {
  try {
    const response = await fetch(url, options);
    if (response.status === 429) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      }
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
};

export default function DuckCurveView() {
  const [mmgdCapacity, setMmgdCapacity] = useAtom(mmgdCapacityAtom);
  const [activeScenarioReport, setActiveScenarioReport] = useAtom(activeScenarioReportAtom);
  const [isScenarioReportGenerating, setIsScenarioReportGenerating] = useAtom(isScenarioReportGeneratingAtom);

  const basePeakLoad = 85.0; // GW
  const baseMiddayLoad = 78.0; // GW
  const netMiddayLoad = (baseMiddayLoad - mmgdCapacity).toFixed(1);
  const rampRate = (basePeakLoad - Number(netMiddayLoad)).toFixed(1);

  // Generates an autonomous report based on active simulation metrics using Gemini
  const generateSimulatedScenarioReport = async () => {
    setIsScenarioReportGenerating(true);
    setActiveScenarioReport(null);

    // Canvas API key will be injected at runtime
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    const prompt = `Gere uma análise técnica concisa de 1 parágrafo com as seguintes variáveis de simulação da rede brasileira (SIN):
    - Capacidade instalada de MMGD Solar ativa na rede local: ${mmgdCapacity} GW.
    - Carga Líquida Visível para a telemetria do ONS ao meio-dia: ${netMiddayLoad} GW.
    - Rampa requerida ao anoitecer (18:00): ${rampRate} GW.
    
    Explique o risco de subestimação da pegada de carbono devido à carga por trás do medidor (behind-the-meter) e a velocidade requerida de despacho de fontes de flexibilidade. Seja extremamente técnico e objetivo.`;

    try {
      const response = await fetchWithRetry(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: {
            parts: [{ text: "Aja como o Auditor Principal de Carbono da ONS. Retorne uma resposta curta, precisa e puramente técnica em português." }]
          }
        })
      });

      const result = await response.json();
      const reportText = result.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (reportText) {
        setActiveScenarioReport(reportText);
      } else {
        setActiveScenarioReport("Falha ao gerar o parecer técnico de estabilidade. Estrutura de dados inválida.");
      }
    } catch (e) {
      setActiveScenarioReport("Erro de conexão na requisição do relatório sintético.");
    } finally {
      setIsScenarioReportGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-container-high pb-4">
        <span className="text-[10px] font-bold uppercase text-textSecondary tracking-wider block">Dinâmica de Carga</span>
        <h1 className="text-2xl font-bold text-textPrimary tracking-tight">O Efeito MMGD e a "Curva do Pato"</h1>
        <p className="text-sm text-textSecondary mt-2 max-w-4xl leading-relaxed">
          A Micro e Minigeração Distribuída atua como "carga negativa" invisível para a telemetria do ONS. Sem reconstruir a carga bruta (<code className="bg-container-low px-1 font-mono">L_gross = L_net + G_MMGD</code>), o sistema subestima o consumo real e superestima a intensidade de carbono nas horas de pico solar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Controlador do Simulador */}
        <div className="lg:col-span-1 bg-surface p-6 border border-container-high flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider flex items-center gap-2">
                <Sun className="w-4 h-4 text-accent-gold" />
                Injeção Solar MMGD
              </h3>
              <p className="text-[10px] text-textSecondary mt-1">Simule a capacidade instalada fotovoltaica no estado.</p>
            </div>

            <div className="space-y-3 bg-container-low p-4 border border-container-high">
              <div className="flex justify-between items-baseline font-mono">
                <span className="text-3xl font-bold text-accent-orange">{mmgdCapacity.toFixed(1)}</span>
                <span className="font-bold text-textSecondary text-xs">GW</span>
              </div>
              <input 
                type="range" min="0" max="30" step="0.5" 
                value={mmgdCapacity}
                onChange={(e) => setMmgdCapacity(Number(e.target.value))}
                className="w-full accent-accent-orange h-1.5 bg-container-high cursor-pointer appearance-none"
              />
            </div>

            <div className="pt-4 border-t border-container-high space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-textSecondary">Carga Líquida Visível:</span>
                <span className="font-bold text-textPrimary">{netMiddayLoad} GW</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-textSecondary">Rampa Noturna:</span>
                <span className="font-bold text-accent-magenta">{rampRate} GW</span>
              </div>
            </div>
          </div>

          {/* ACIONADOR INTEGRAÇÃO GEMINI: PARECER TÉCNICO AUTÔNOMO */}
          <div className="pt-4 border-t border-container-high space-y-3">
            <button
              onClick={generateSimulatedScenarioReport}
              disabled={isScenarioReportGenerating}
              className="w-full bg-kinetic-gradient text-textPrimary text-[10px] font-bold uppercase tracking-wider py-3 rounded-none flex items-center justify-center gap-2 hover:opacity-95 transition-all disabled:opacity-50"
            >
              {isScenarioReportGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>A processar IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gerar Relatório de Impacto IA</span>
                </>
              )}
            </button>

            {/* Painel de Exibição do Parecer Gerado pelo Gemini */}
            {activeScenarioReport && (
              <div className="bg-container-elevated border-l-2 border-accent-orange p-3 animate-in fade-in duration-300">
                <span className="text-[8px] font-bold uppercase text-accent-orange tracking-widest font-mono block mb-1">Parecer ONS AI</span>
                <p className="text-[10px] text-textSecondary leading-relaxed font-mono">{activeScenarioReport}</p>
              </div>
            )}
          </div>
        </div>

        {/* Representação Visual da Curva */}
        <div className="lg:col-span-2 bg-surface p-6 border border-container-high flex flex-col relative h-[350px]">
          <span className="text-[10px] font-bold uppercase text-textSecondary tracking-wider absolute top-6 left-6">Perfil Abstrato de Carga (Meio-dia vs Anoitecer)</span>
          
          <div className="flex items-end flex-1 gap-12 mt-12 w-full px-12 pb-4">
            
            {/* Barra 12:00 (Com impacto MMGD) */}
            <div className="flex-1 flex flex-col items-center justify-end relative h-full">
              {/* Bloco MMGD (Invisível para o ONS) */}
              <div 
                className="w-full border-2 border-dashed border-accent-gold bg-accent-gold/10 flex items-center justify-center transition-all duration-300 relative z-10"
                style={{ height: `${(mmgdCapacity / basePeakLoad) * 100}%` }}
              >
                <span className="text-[8px] font-mono font-bold text-accent-orange uppercase text-center leading-none p-1">
                  MMGD<br/>Oculta
                </span>
              </div>
              {/* Bloco de Carga Líquida */}
              <div 
                className="w-full bg-container-low transition-all duration-300 relative border border-container-high"
                style={{ height: `${(Number(netMiddayLoad) / basePeakLoad) * 100}%` }}
              >
                <span className="absolute top-2 left-0 w-full text-center text-[10px] text-textPrimary font-mono font-bold">L_net</span>
              </div>
              <span className="mt-3 text-xs font-bold font-mono text-textSecondary">12:00</span>
            </div>

            {/* Ícone de Rampa */}
            <div className="flex flex-col items-center justify-center h-full w-8">
              <div className="h-full w-px bg-container-high relative flex items-center justify-center">
                <TrendingDown className="absolute text-accent-magenta w-6 h-6 rotate-180 bg-surface p-1 border border-container-high" />
              </div>
            </div>

            {/* Barra 18:00 (Pico Sem Solar) */}
            <div className="flex-1 flex flex-col items-center justify-end relative h-full">
              <div 
                className="w-full bg-kinetic-gradient transition-all duration-300"
                style={{ height: '100%' }}
              />
              <span className="mt-3 text-xs font-bold font-mono text-textSecondary">18:00</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
