import React from 'react';
import { Globe } from 'lucide-react';

const MACRO_METRICS = [
  { region: 'Holanda', price: '€86,8/MWh', correlation: '-0,83', negativeHours: 584, carbon: '262,2 gCO₂eq/kWh' },
  { region: 'Alemanha', price: '€89,3/MWh', correlation: '-0,89', negativeHours: 576, carbon: '~240,0 gCO₂eq/kWh' },
  { region: 'Espanha', price: '€65,0 - €95,0', correlation: 'Forte Neg.', negativeHours: 477, carbon: '133,6 gCO₂eq/kWh' },
  { region: 'Bélgica', price: '€82,5/MWh', correlation: '-0,80', negativeHours: 519, carbon: '~140,0 gCO₂eq/kWh' },
  { region: 'França', price: '€61,1/MWh', correlation: 'Forte Neg.', negativeHours: 513, carbon: '~45,0 gCO₂eq/kWh' },
  { region: 'Brasil (SIN)', price: 'PLD (Dinâmico)', correlation: 'Baixa / Hidrológica', negativeHours: 0, carbon: '21,5 - 28,9 gCO₂eq/kWh' },
];

export default function MacroView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-container-high pb-4">
        <span className="text-[10px] font-bold uppercase text-textSecondary tracking-wider block">Contexto Macro</span>
        <h1 className="text-2xl font-bold text-textPrimary tracking-tight">O Paradigma do Efeito "Ordem de Mérito"</h1>
        <p className="text-sm text-textSecondary mt-2 max-w-4xl leading-relaxed">
          Na Europa, a forte correlação negativa entre energias renováveis e preços gera centenas de horas de <strong className="text-textPrimary">preços negativos</strong>. O Brasil, ancorado na hidroeletricidade (56,1%), apresenta estabilidade no PLD, exceto quando as linhas de transmissão sofrem congestionamento, forçando o despacho térmico local.
        </p>
      </div>

      <div className="bg-surface p-0 rounded-none border border-container-high overflow-hidden shadow-none">
        <div className="p-4 border-b border-container-high flex items-center gap-2 bg-container-low">
          <Globe className="w-4 h-4 text-accent-orange" />
          <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider">Tabela Comparativa Global (2025)</h3>
        </div>

        <div className="w-full text-left font-mono overflow-x-auto">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-bg text-textPrimary text-[9px] font-bold uppercase tracking-wider">
              <div>Região</div>
              <div>Preço Médio</div>
              <div>Corr. Preço-Carbono</div>
              <div>Horas Negativas</div>
              <div>Pegada de Carbono</div>
            </div>
            
            <div className="divide-y divide-container-high">
              {MACRO_METRICS.map((row, idx) => (
                <div 
                  key={idx} 
                  className={`grid grid-cols-5 gap-4 px-6 py-4 text-[11px] items-center transition-colors ${
                    row.region.includes('Brasil') ? 'bg-accent-gold/5 border-l-4 border-accent-orange' : 'hover:bg-container-low'
                  }`}
                >
                  <div className="font-bold text-sans text-xs text-textPrimary">{row.region}</div>
                  <div className="text-textSecondary">{row.price}</div>
                  <div className={row.correlation.includes('Neg') || row.correlation.includes('-') ? 'text-accent-magenta font-bold' : 'text-textSecondary'}>{row.correlation}</div>
                  <div className="text-textSecondary">{row.negativeHours}h</div>
                  <div className="font-bold text-textSecondary">{row.carbon}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface p-6 border border-container-high">
          <span className="text-[9px] font-bold uppercase text-textSecondary tracking-wider block">A Anomalia Brasileira</span>
          <p className="text-xs text-textPrimary mt-3 leading-relaxed font-mono">
            "A divergência preço-carbono no Brasil ocorre apenas quando as interligações estaduais atingem o limite de transferência. Isso restringe o escoamento de energia eólica do Nordeste, ativando usinas térmicas fósseis no Sudeste."
          </p>
        </div>
        <div className="bg-container-low p-6 border border-container-high flex flex-col justify-center">
          <span className="text-[9px] font-bold uppercase text-textSecondary tracking-wider block">Fator Médio MCTI (2025)</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tighter text-textPrimary">21,5</span>
            <span className="text-xs font-mono font-bold text-accent-orange">gCO₂eq/kWh</span>
          </div>
          <p className="text-[10px] text-textSecondary mt-2 border-t border-container-high pt-2">Dez vezes menor do que a média da rede alemã.</p>
        </div>
      </div>
    </div>
  );
}
