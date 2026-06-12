import { HiArrowLeft } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function ConcessionariasPanel() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/distribuidoras-list.json')
      .then(res => res.json())
      .then(list => {
        setData(list);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load distributors list", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex max-h-[calc(100vh_-_80px)] flex-col py-5 pl-5 pr-1">
      <div className="flex w-full grow flex-row pl-2 pb-5">
        <Link className="text-3xl mr-4 self-center" to="/" data-test-id="left-panel-back-button">
          <HiArrowLeft />
        </Link>
        <div className="w-full">
          <div className="text-xl font-bold tracking-[-0.01em] leading-tight text-zinc-900 dark:text-zinc-50">
            Auditoria de Redes
          </div>
          <div className="text-xs font-mono text-zinc-500 mt-1">
            Concessionárias & Permissionárias
          </div>
        </div>
      </div>

      <div className="overflow-y-auto pr-3 space-y-4 pb-10">
        {loading ? (
          <div className="text-xs font-mono text-zinc-500 animate-pulse">A carregar telemetria...</div>
        ) : (
          data.map((f, i) => (
            <div key={i} className="bg-zinc-100 p-4 border-l-4 dark:bg-zinc-900 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800" style={{ borderLeftColor: f.quality_color || '#FF6600' }}>
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                  {f.ysh_name || 'Desconhecida'}
                </h4>
                <span className="text-[9px] bg-zinc-200 dark:bg-zinc-800 px-2 py-1 font-mono font-bold uppercase text-zinc-900 dark:text-zinc-50">
                  {f.ysh_boundary_type || 'N/A'}
                </span>
              </div>
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-zinc-500 uppercase font-bold">Área Geográfica:</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-50">
                    {parseFloat(f.ysh_area_km2 || 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} km²
                  </span>
                </div>
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-zinc-500 uppercase font-bold">Prazo Religação:</span>
                  <span className="font-bold" style={{ color: f.quality_color }}>
                    {f.quality_score ? `${f.quality_score.toFixed(1)}% (${f.quality_status})` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-zinc-500 uppercase font-bold">Usinas (SIGA):</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-50">
                    {f.usinas_siga || 0} operacionais
                  </span>
                </div>
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-zinc-500 uppercase font-bold">Capacidade GD:</span>
                  <span className="font-bold text-[#FF6600]">
                    {(f.potencia_mw || 0).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MW
                  </span>
                </div>
                {(f.projetos_pd !== undefined && f.projetos_pd > 0) && (
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-zinc-500 uppercase font-bold">Projetos P&D:</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-50">
                      {f.projetos_pd} ({f.investimento_pd >= 1000000 ? `R$ ${(f.investimento_pd / 1000000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}M` : `R$ ${f.investimento_pd.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`})
                    </span>
                  </div>
                )}
                {(f.projetos_pe !== undefined && f.projetos_pe > 0) && (
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-zinc-500 uppercase font-bold">Projetos EE:</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-50">
                      {f.projetos_pe} ({f.investimento_pe >= 1000000 ? `R$ ${(f.investimento_pe / 1000000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}M` : `R$ ${f.investimento_pe.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`})
                    </span>
                  </div>
                )}
                {(f.interrupcoes_2017 !== undefined && f.interrupcoes_2017 > 0) && (
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-zinc-500 uppercase font-bold">Interrupções (2017):</span>
                    <span className="font-bold text-[#FF3B30] dark:text-[#FF453A]">
                      {f.interrupcoes_2017.toLocaleString('pt-BR')} reg.
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-zinc-500 uppercase font-bold">Fonte de Dados:</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-50 opacity-80">
                    {f.ysh_geometry_source || 'ANEEL'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}