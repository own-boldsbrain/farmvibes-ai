import os
import sys
import duckdb
import json

# Setup de caminhos
BASE_INFRA_PATH = r"C:\Users\fjuni\Projects\01-Upstream\04-YSH-Energy\ysh-packages\infra"
DB_PATH = os.path.join(BASE_INFRA_PATH, "data", "50_curated", "duckdb", "analytical.duckdb")
ANEEL_DB_PATH = os.path.join(BASE_INFRA_PATH, "data", "50_curated", "duckdb", "ysh_aneel.duckdb")

# Adicionar engines ao path para importação
ENGINES_PATH = r"C:\Users\fjuni\Projects\01-Upstream\04-YSH-Energy\ysh-packages\packages\engines"
sys.path.append(ENGINES_PATH)

from energy.nrel_service import NRELService
from financials.energy_financials import EnergyFinancials

class KPIExtractor:
    def __init__(self):
        print(f"[*] Conectando aos bancos de dados DuckDB...")
        self.conn = duckdb.connect(DB_PATH, read_only=True)
        # Tenta atachar o banco ANEEL
        if os.path.exists(ANEEL_DB_PATH):
            try:
                self.conn.execute(f"ATTACH '{ANEEL_DB_PATH}' AS ysh_aneel (READ_ONLY);")
            except Exception as e:
                pass
                
        # Carregar extensões de mapa
        self.conn.execute("INSTALL spatial; LOAD spatial;")
        
    def _get_local_kpis(self, lat, lon):
        """Passo 1: Encontra a distribuidora responsável e informações locais."""
        # Utilizamos St_Intersects para descobrir em qual polígono a coordenada está.
        query = f"""
            SELECT 
                COALESCE(ysh_id, objectid::VARCHAR) as id,
                COALESCE(ysh_agent_name, concessionaria_1, permissionaria_1, NOME) as agent_name,
                ysh_agent_code,
                ysh_boundary_type
            FROM bdgd_concessionarias
            WHERE ST_Intersects(geom, ST_Point({lon}, {lat}))
            LIMIT 1;
        """
        try:
            result = self.conn.execute(query).fetchone()
            if result:
                return {
                    "lat": lat,
                    "lon": lon,
                    "distribuidora_id": result[0],
                    "distribuidora_name": result[1],
                    "agent_code": result[2],
                    "concession_type": result[3]
                }
            return None
        except Exception as e:
            print(f"[!] Erro ao buscar Local KPIs: {e}")
            return None

    def _get_energy_cost_kpis(self, agent_name):
        """Passo 2: Busca tarifas ativas e bandeiras para a distribuidora."""
        # Mapeia agente nome geo para CNPJ e busca tarifa
        query = f"""
            SELECT 
                valor_tusd,
                valor_te,
                modalidade,
                subgrupo,
                inicio_vigencia,
                fim_vigencia
            FROM vw_360_tarifas_e_faturamento
            WHERE UPPER(nome_geo) = UPPER('{agent_name}')
              AND UPPER(subgrupo) = 'B1' -- Consumidor B1 (Residencial default)
            ORDER BY fim_vigencia DESC
            LIMIT 1;
        """
        try:
            result = self.conn.execute(query).fetchone()
            if result:
                tusd_str = str(result[0]).replace(',', '.') if result[0] else "0"
                te_str = str(result[1]).replace(',', '.') if result[1] else "0"
                
                tusd = float(tusd_str) / 1000.0
                te = float(te_str) / 1000.0
                return {
                    "tarifa_tusd": tusd,
                    "tarifa_te": te,
                    "tarifa_total_com_impostos": (tusd + te), # Sem ICMS calculado explicitamente ainda
                    "modalidade": result[2],
                    "subgrupo": result[3]
                }
            return {
                "tarifa_tusd": 0.0,
                "tarifa_te": 0.0,
                "tarifa_total_com_impostos": 0.95, # Default Brasil 0.95 R$/kWh
                "modalidade": "N/A",
                "subgrupo": "N/A"
            }
        except Exception as e:
            print(f"[!] Erro ao buscar Energy Cost KPIs: {e}")
            return None

    def _get_solar_kpis(self, lat, lon, system_capacity):
        """Passo 3: Integração API NREL PVWatts."""
        res = NRELService.get_solar_estimate(lat, lon, system_capacity=system_capacity)
        if res:
            return res
        return {
            "annual_generation": system_capacity * 4.5 * 30 * 12, # Estimativa super rough
            "solar_resource": 4.5
        }

    def _get_financial_kpis(self, annual_generation_kwh, system_capacity_kw, energy_tariff):
        """Passo 4: Cálculo Financeiro de Payback, TIR, VPL."""
        res = EnergyFinancials.calculate_kpis(annual_generation_kwh, system_capacity_kw, energy_tariff)
        return res

    def _get_carbon_kpis(self, annual_generation_kwh):
        """Passo 5: Geração de créditos e TCO2e."""
        # Emissão media do SIN (Brasil) é aprox. 0.04 a 0.09 kg CO2/kWh dependendo do mês. 
        # Usaremos média conservadora 0.07 kg/kWh = 0.00007 Toneladas/kWh
        FACTOR_CO2_KWH = 0.00007
        tco2e_evitado = annual_generation_kwh * FACTOR_CO2_KWH
        
        return {
            "tco2e_evitado_ano": float(tco2e_evitado),
            "arvores_equivalentes_ano": int(tco2e_evitado * 7), # Aprox 7 árvores plantadas compensam 1 TCO2e
            "gasolina_litros_evitados": int(tco2e_evitado * 430) # 1 TCO2e = 430 litros de gasolina
        }

    def extract(self, lat, lon, system_capacity_kw=5.0):
        print(f"--- Iniciando Extração de KPIs ({lat}, {lon}) - Sistema: {system_capacity_kw}kW ---")
        
        # 1. Local
        local = self._get_local_kpis(lat, lon)
        if not local:
            print("[x] Erro: Distribuidora não encontrada para a localização.")
            return None
        print(f" -> Local: {local['distribuidora_name']}")
        
        # 2. Custos
        cost = self._get_energy_cost_kpis(local["distribuidora_name"])
        if not cost:
            cost = {
                "tarifa_tusd": 0.0,
                "tarifa_te": 0.0,
                "tarifa_total_com_impostos": 0.95,
                "modalidade": "N/A",
                "subgrupo": "N/A"
            }
        print(f" -> Custo Energia: R$ {cost['tarifa_total_com_impostos']:.2f}/kWh")
        
        # 3. Solar
        solar = self._get_solar_kpis(lat, lon, system_capacity_kw)
        print(f" -> Solar: {solar['annual_generation']:.2f} kWh/ano (Irradiação: {solar['solar_resource']})")
        
        # 4. Financeiros
        finance = self._get_financial_kpis(solar["annual_generation"], system_capacity_kw, cost["tarifa_total_com_impostos"])
        print(f" -> Financeiro: TIR {finance['irr']*100:.2f}% | Payback: {finance['payback_years']:.1f} anos")
        
        # 5. Carbono
        carbon = self._get_carbon_kpis(solar["annual_generation"])
        print(f" -> Carbono: {carbon['tco2e_evitado_ano']:.2f} TCO2e evitadas")
        
        return {
            "location_kpis": local,
            "cost_kpis": cost,
            "solar_kpis": solar,
            "financial_kpis": finance,
            "carbon_kpis": carbon
        }
        
    def close(self):
        self.conn.close()

if __name__ == "__main__":
    extractor = KPIExtractor()
    
    # Test cases: 3 regiões do Brasil
    # 1. Sudeste (SP - CPFL Paulista)
    # 2. Nordeste (BA - Neoenergia Coelba)
    # 3. Sul (PR - Copel)
    
    pontos = [
        {"nome": "São Paulo / SP", "lat": -23.5505, "lon": -46.6333},
        {"nome": "Salvador / BA", "lat": -12.9714, "lon": -38.5014},
        {"nome": "Curitiba / PR", "lat": -25.4284, "lon": -49.2733}
    ]
    
    resultados = []
    for pt in pontos:
        print(f"\n[ Testando {pt['nome']} ]")
        res = extractor.extract(pt["lat"], pt["lon"], system_capacity_kw=6.0)
        if res:
            res["cidade"] = pt["nome"]
            resultados.append(res)
            
    # Salva json
    with open("kpi_extraction_results.json", "w", encoding="utf-8") as f:
        json.dump(resultados, f, indent=2, ensure_ascii=False)
        
    print("\n[+] Processamento concluído. Resultados salvos em kpi_extraction_results.json")
    extractor.close()
