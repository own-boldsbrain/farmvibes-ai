import os
import sys

file_path = r'web\src\features\panels\concessionarias\ConcessionariasPanel.tsx'
content = '''import { HiArrowLeft } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function ConcessionariasPanel() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/data/rs-concessionarias.geojson').then(res => res.json()),
      fetch('/data/rs-permissionarias.geojson').then(res => res.json())
    ]).then(([conc, perm]) => {
      const allFeatures = [...(conc.features || []), ...(perm.features || [])];
      allFeatures.sort((a, b) => (parseFloat(b.properties?.ysh_area_km2 || 0) - parseFloat(a.properties?.ysh_area_km2 || 0)));
      setData(allFeatures);
      setLoading(false);
    }).catch(err => {
      console.error("Failed to load geojson", err);
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
            <div key={i} className="bg-zinc-100 p-4 border-l-4 border-[#FF6600] dark:bg-zinc-900 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                  {f.properties?.ysh_name || f.properties?.concessionaria_1 || f.properties?.permissionaria_1 || 'Desconhecida'}
                </h4>
                <span className="text-[9px] bg-zinc-200 dark:bg-zinc-800 px-2 py-1 font-mono font-bold uppercase text-zinc-900 dark:text-zinc-50">
                  {f.properties?.ysh_boundary_type || 'N/A'}
                </span>
              </div>
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-zinc-500 uppercase font-bold">Área Geográfica:</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-50">
                    {parseFloat(f.properties?.ysh_area_km2 || 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} km²
                  </span>
                </div>
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-zinc-500 uppercase font-bold">Fonte de Dados:</span>
                  <span className="font-bold text-[#FF6600]">
                    {f.properties?.ysh_geometry_source || 'ANEEL'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}'''

os.makedirs(os.path.dirname(file_path), exist_ok=True)
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

file_path_leftpanel = r'web\src\features\panels\LeftPanel.tsx'
with open(file_path_leftpanel, 'r', encoding='utf-8') as f:
    content_lp = f.read()

old_import = "import FAQPanel from './faq/FAQPanel';"
new_import = "import FAQPanel from './faq/FAQPanel';\nimport ConcessionariasPanel from './concessionarias/ConcessionariasPanel';"
content_lp = content_lp.replace(old_import, new_import)

old_route = '<Route path="/faq" element={<FAQPanel\n />} />'
new_route = '<Route path="/faq" element={<FAQPanel />} />\n        <Route path="/concessionarias" element={<ConcessionariasPanel />} />'
if '<Route path="/concessionarias"' not in content_lp:
    content_lp = content_lp.replace(old_route, new_route)

old_route2 = '<Route path="/faq" element={<FAQPanel />} />'
new_route2 = '<Route path="/faq" element={<FAQPanel />} />\n        <Route path="/concessionarias" element={<ConcessionariasPanel />} />'
if '<Route path="/concessionarias"' not in content_lp:
    content_lp = content_lp.replace(old_route2, new_route2)

with open(file_path_leftpanel, 'w', encoding='utf-8') as f:
    f.write(content_lp)

file_path_ranking = r'web\src\features\panels\ranking-panel\RankingPanel.tsx'
with open(file_path_ranking, 'r', encoding='utf-8') as f:
    content_rk = f.read()

old_rk = '''      <div className="space-y-4 p-2">        
        <InfoText />'''
new_rk = '''      <div className="space-y-4 p-2">        
        <a href="/concessionarias" className="mt-2 w-full flex items-center justify-between bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 py-3 px-4 text-[11px] font-bold uppercase tracking-[0.05em] transition-all hover:bg-zinc-800 dark:hover:bg-zinc-200">
          <span>Auditoria de Redes (ANEEL)</span>
          <span>&gt;</span>
        </a>
        <InfoText />'''
content_rk = content_rk.replace(old_rk, new_rk)

with open(file_path_ranking, 'w', encoding='utf-8') as f:
    f.write(content_rk)

print("Done creating lane")
