import React from 'react';
import { useAtom } from 'jotai';
import { 
  Send, 
  RefreshCw, 
  Sparkles, 
  BookOpen, 
  ExternalLink 
} from 'lucide-react';
import { 
  promptInputAtom, 
  terminalHistoryAtom, 
  isAiGeneratingAtom, 
  useGoogleGroundingAtom 
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

export default function AiTerminalView() {
  const [promptInput, setPromptInput] = useAtom(promptInputAtom);
  const [terminalHistory, setTerminalHistory] = useAtom(terminalHistoryAtom);
  const [isAiGenerating, setIsAiGenerating] = useAtom(isAiGeneratingAtom);
  const [useGoogleGrounding, setUseGoogleGrounding] = useAtom(useGoogleGroundingAtom);

  // Communicates with Gemini 3 Flash Preview
  const executeAiQuery = async (queryText: string, isSystemTrigger = false) => {
    if (!queryText.trim()) return;

    setIsAiGenerating(true);
    
    // Add user prompt to the local state history
    if (!isSystemTrigger) {
      setTerminalHistory(prev => [...prev, { role: 'user', text: queryText, sources: [] }]);
      setPromptInput('');
    }

    // Load API key from environment variable or use the fallback key found in .env.local
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || "AIzaSyCk-KqG24FnM6gtsGJ1GHUlgFhDE1zMMZA";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    const systemPrompt = `Você é o Engenheiro Analista Principal de Redes e Carbono da YSH. 
    Seu papel é auditar o SIN (Sistema Interligado Nacional) brasileiro, as regras da ANEEL (como a REN 1000/2021 e a compensação de MMGD), 
    o efeito merit-order e os fluxos de carbono usando a Formulação de Bialek. 
    Responda em formato técnico estruturado, preferindo análise fria, métricas precisas e terminologias da engenharia de redes.`;

    const payload: any = {
      contents: [{ parts: [{ text: queryText }] }],
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      }
    };

    // Activate Google Search Grounding if enabled by the user
    if (useGoogleGrounding) {
      payload.tools = [{ "google_search": {} }];
    }

    try {
      const response = await fetchWithRetry(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      const candidate = result.candidates?.[0];

      if (candidate && candidate.content?.parts?.[0]?.text) {
        const text = candidate.content.parts[0].text;

        // Extract sources metadata from Google Search grounding
        let sources: Array<{ uri: string; title: string }> = [];
        const groundingMetadata = candidate.groundingMetadata;
        if (groundingMetadata && groundingMetadata.groundingAttributions) {
          sources = groundingMetadata.groundingAttributions
            .map((attribution: any) => ({
              uri: attribution.web?.uri,
              title: attribution.web?.title,
            }))
            .filter((source: any) => source.uri && source.title);
        }

        setTerminalHistory(prev => [...prev, { role: 'model', text, sources }]);
      } else {
        setTerminalHistory(prev => [...prev, { 
          role: 'model', 
          text: 'Erro: O modelo retornou uma estrutura inesperada de dados ou foi bloqueado por filtros de segurança.', 
          sources: [] 
        }]);
      }
    } catch (error) {
      setTerminalHistory(prev => [...prev, { 
        role: 'model', 
        text: 'Erro crítico na comunicação com o backend do Gemini. Verifique a conectividade com o modelo.', 
        sources: [] 
      }]);
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-container-high pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase text-textSecondary tracking-wider block">Auditoria Digital</span>
          <h1 className="text-2xl font-bold text-textPrimary tracking-tight">Co-Piloto de Carbono & Regulação</h1>
          <p className="text-sm text-textSecondary mt-1">
            Consulte o modelo <code className="bg-container-low px-1 font-bold font-mono">gemini-3-flash-preview</code> com pesquisa do Google integrada sobre o SIN.
          </p>
        </div>

        {/* Grounding switch */}
        <div className="flex items-center gap-3 bg-surface p-3 border border-container-high">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase text-textPrimary">Google Grounding</span>
            <span className="text-[8px] text-textSecondary font-mono">Resoluções ANEEL e notícias em tempo real</span>
          </div>
          <button
            onClick={() => setUseGoogleGrounding(!useGoogleGrounding)}
            className={`w-12 h-6 flex items-center p-1 cursor-pointer transition-all ${useGoogleGrounding ? 'bg-emerald-500' : 'bg-container-high'}`}
          >
            <div className={`bg-white w-4 h-4 transform transition-all ${useGoogleGrounding ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* HISTÓRICO DE CHAT DO TERMINAL */}
      <div className="bg-surface border border-container-high flex flex-col h-[400px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {terminalHistory.map((chat, idx) => (
            <div 
              key={idx} 
              className={`p-4 ${
                chat.role === 'user' 
                  ? 'bg-container-low border-l-4 border-textPrimary' 
                  : 'bg-container-elevated border-l-4 border-accent-orange'
              }`}
            >
              <span className="text-[9px] font-bold font-mono uppercase tracking-widest block mb-1 text-textSecondary">
                {chat.role === 'user' ? 'Utilizador / Auditor' : 'Gemini Co-Pilot'}
              </span>
              
              <p className="text-xs text-textPrimary leading-relaxed font-mono whitespace-pre-wrap">
                {chat.text}
              </p>

              {/* Rendering das fontes de Grounding do Google Search */}
              {chat.sources && chat.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-container-high space-y-1.5">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    Fontes Verificadas (Google Search Grounding)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {chat.sources.map((source, sIdx) => (
                      <a 
                        key={sIdx} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[9px] bg-surface border border-container-high px-2 py-1 text-textSecondary hover:text-accent-orange hover:border-accent-orange transition-all flex items-center gap-1 font-mono"
                      >
                        <span className="truncate max-w-[150px]">{source.title}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isAiGenerating && (
            <div className="p-4 bg-container-low border-l-4 border-accent-gold space-y-2 animate-pulse">
              <span className="text-[9px] font-bold font-mono uppercase tracking-widest text-textSecondary block">A pesquisar fontes e processando resposta...</span>
              <div className="h-1 bg-kinetic-gradient w-full" />
            </div>
          )}
        </div>

        {/* INPUT DO TERMINAL */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            executeAiQuery(promptInput);
          }}
          className="p-3 bg-container-low border-t border-container-high flex gap-2"
        >
          <input 
            type="text" 
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Faça uma consulta ou auditoria do SIN: ex. 'Explique o impacto do fator de redução na MMGD'"
            disabled={isAiGenerating}
            className="flex-1 bg-surface p-3 text-xs font-mono outline-none border border-transparent focus:border-accent-orange text-textPrimary"
          />
          <button 
            type="submit"
            disabled={isAiGenerating || !promptInput.trim()}
            className="bg-kinetic-gradient text-textPrimary px-6 py-3 font-bold uppercase tracking-wider text-[10px] disabled:opacity-50 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submeter</span>
          </button>
        </form>
      </div>

      {/* Prompts sugeridos baseados em diretrizes ANEEL e MCTI */}
      <div className="space-y-2">
        <span className="text-[9px] font-bold uppercase text-textSecondary tracking-wider block">Fórmulas e Casos de Teste Regulamentares</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button 
            onClick={() => executeAiQuery("Quais são os fatores de emissão oficiais do MCTI SIRENE para 2025 no SIN?")}
            className="p-3 bg-surface border border-container-high text-left hover:border-accent-orange transition-all"
          >
            <span className="text-[8px] font-mono text-accent-orange block mb-1">MCTI / SIRENE</span>
            <p className="text-[10px] font-mono text-textSecondary leading-tight">Consultar fatores de emissão oficiais da rede em 2025.</p>
          </button>
          
          <button 
            onClick={() => executeAiQuery("Como o Método de Perda Média de Rede equilibra a matriz de Bialek?")}
            className="p-3 bg-surface border border-container-high text-left hover:border-accent-orange transition-all"
          >
            <span className="text-[8px] font-mono text-accent-orange block mb-1">Bialek & Perdas</span>
            <p className="text-[10px] font-mono text-textSecondary leading-tight">Explicar formulação matemática para sistemas de transmissão com perdas.</p>
          </button>

          <button 
            onClick={() => executeAiQuery("Quais os requisitos regulamentares de MMGD da REN ANEEL 1000/2021 para classe residencial?")}
            className="p-3 bg-surface border border-container-high text-left hover:border-accent-orange transition-all"
          >
            <span className="text-[8px] font-mono text-accent-orange block mb-1">ANEEL REN 1000/2021</span>
            <p className="text-[10px] font-mono text-textSecondary leading-tight">Auditar direitos de compensação e limites de potência residencial.</p>
          </button>
        </div>
      </div>

    </div>
  );
}
