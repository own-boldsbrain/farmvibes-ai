import React from 'react';
import { Map, ShieldAlert } from 'lucide-react';

const SUBMARKETS = [
  { id: 'SE/CO', name: 'Sudeste / Centro-Oeste', states: 'SP, RJ, MG, ES, GO, MT, MS, DF', source: 'Hidro, Biomassa, Gás', type: 'Importador / Balanço' },
  { id: 'SUL', name: 'Sul', states: 'PR, SC, RS', source: 'Hidro, Eólica, Carvão', type: 'Sazonal' },
  { id: 'NE', name: 'Nordeste', states: 'BA, PE, CE, RN, PB, MA, PI, AL, SE', source: 'Eólica, Solar', type: 'Exportador Líquido' },
  { id: 'NORTE', name: 'Norte', states: 'AM, PA, TO, RO, AP', source: 'Hidro, Fóssil', type: 'Exportador Sazonal' },
];

export default function BialekView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-container-high pb-4">
        <span className="text-[10px] font-bold uppercase text-textSecondary tracking-wider block">Rastreamento Topológico</span>
        <h1 className="text-2xl font-bold text-textPrimary tracking-tight">Matriz de Compartilhamento de Bialek</h1>
        <p className="text-sm text-textSecondary mt-2 max-w-4xl leading-relaxed">
          A pegada de carbono baseada puramente na produção estadual ignora as interligações. O algoritmo de Bialek rastreia o fluxo de eletricidade na rede (SIN) para calcular o mix de energia <strong className="text-textPrimary">realmente consumido</strong> em cada estado.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SUBMARKETS.map(sub => (
          <div key={sub.id} className="bg-surface border border-container-high p-5 hover:border-accent-orange transition-colors relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-textPrimary group-hover:bg-accent-orange transition-colors" />
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Map className="w-4 h-4 text-textSecondary" />
                <h4 className="text-sm font-bold text-textPrimary leading-none">{sub.name}</h4>
              </div>
              <span className="text-[9px] bg-container-low text-textPrimary font-mono px-2 py-1 font-bold uppercase">{sub.id}</span>
            </div>
            
            <p className="text-[10px] font-mono text-textSecondary leading-relaxed mb-4 min-h-[30px]">{sub.states}</p>
            
            <div className="pt-3 border-t border-container-high space-y-2">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-textSecondary uppercase font-bold">Matriz Dominante:</span>
                <span className="font-bold text-textPrimary">{sub.source}</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-textSecondary uppercase font-bold">Fluxo Nodal:</span>
                <span className="font-bold text-accent-orange">{sub.type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-container-low p-6 text-textPrimary border border-container-high flex items-start gap-4">
        <ShieldAlert className="w-6 h-6 text-accent-gold shrink-0 mt-1" />
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-accent-gold uppercase tracking-wider block">Compensação de Perdas na Rede</span>
          <p className="text-xs leading-relaxed text-textSecondary font-mono">
            Para equilibrar a matriz upstream <span className="bg-surface px-1 py-0.5 border border-container-high">A_u</span>, o framework utiliza o Método de Perda Média, onde <span className="bg-surface px-1 py-0.5 border border-container-high">P_send' = P_receive'</span>. Isto elimina as perdas resistivas das linhas de transmissão, transformando o SIN numa topologia matematicamente 'lossless' e garantindo a estrita conservação da massa de carbono.
          </p>
        </div>
      </div>

    </div>
  );
}
