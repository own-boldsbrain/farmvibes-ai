# PRD — ALOS (Advanced Land Observing Satellite)

## Workflows

- `alos_forest_extent_download.yaml` — Baixa classificação floresta/não-floresta do ALOS
- `alos_forest_extent_download_merge.yaml` — Baixa e mescla os rasters em um único raster

---

## JTBDs (Jobs To Be Done)

1. **Baixar classificação florestal ALOS** — O usuário precisa de mapas de cobertura florestal (floresta/não-floresta) do satélite ALOS para uma região entre 2015 e 2020.
2. **Mesclar tiles em raster único** — O usuário precisa unificar múltiplos tiles baixados em um único raster contínuo.

---

## Casos de Uso

- **C1:** Cientista ambiental quer analisar a extensão florestal de uma região na América do Sul.
- **C2:** Agrônomo precisa de máscara floresta/não-floresta para planejar manejo.
- **C3:** Pesquisador de carbono precisa do raster mesclado para calcular biomassa.

---

## Faz / Não Faz

### Faz

- Listar produtos ALOS via Planetary Computer.
- Baixar classificações floresta/não-floresta (2015–2020).
- Mesclar rasters por ano (`group_rasters_by_time` com critério "year").

### Não Faz

- Não classifica além de floresta/não-floresta.
- Não suporta outros produtos ALOS (ex.: DEM).
- Não faz correção geométrica.

---

## Users Inputs

| Parâmetro | Workflow | Tipo | Descrição |
|-----------|----------|------|-----------|
| `pc_key` | `*merge*` | string | Chave opcional da Planetary Computer |
| `user_input` | Ambos | geometry | Geometria de interesse |

---

## System Outputs

### `alos_forest_extent_download`

- **sink:** `downloaded_product` — Rasters individuais de classificação floresta/não-floresta.

### `alos_forest_extent_download_merge`

- **sink:** `merged_raster` — Raster mesclado.
- **sink:** `categorical_raster` — Raster categórico individual.

---

## Outcomes Esperados

- Mapas de extensão florestal disponíveis como rasters locais.
- Raster único e contínuo (merged) para a região de interesse.

---

## APIs

- **Planetary Computer API:** `https://planetarycomputer.microsoft.com/api/stac/v1`
- **Conector:** STAC (SpatioTemporal Asset Catalog)
- **Coleção:** `alos-forest-extent`

---

## CRUD

| Operação | Descrição |
|----------|-----------|
| GET (list) | Lista produtos ALOS que intersectam a geometria |
| GET (download) | Download dos rasters |

---

## Bancos de Dados

- **Externo:** Planetary Computer (Microsoft) — catálogo STAC.
- **Interno:** Rasters GeoTIFF locais.

---

## Datasets e JSON Files

- **Coleção STAC:** `alos-forest-extent` com período 2015–2020.
- **Metadados:** JSON de resposta do Planetary Computer.

---

## Tabelas

N/A.

---

## Lógicas e Cálculos

- **Agrupamento:** Rasters são agrupados pelo ano (`criterion: "year"`).
- **Merge:** Rasters de cada grupo são mesclados em um único raster.
- **Fluxo merge:** `list_alos_products` → `download_alos` → `group_rasters_by_time` → `merge_rasters`.

---

## Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Mercado de Carbono | REDD+, Reflorestamento | Classificação floresta/não-floresta (2015–2020) | Baseline de carbono florestal para projetos de crédito |
| Biomassa / Bioenergia | Floresta energética | Extensão florestal para estimativa de biomassa | Mapa de áreas disponíveis para manejo florestal energético |
| Geração Hidrelétrica | UHE, PCH | Monitoramento de cobertura vegetal em bacias | Dados de vegetação para análise de assoreamento de reservatórios |
| Geração Solar | GC | Zoneamento de uso do solo | Classificação de áreas antropizadas para implantação de usinas |
| Óleo e Gás | Exploração | Monitoramento ambiental em concessões | Detecção de desmatamento em áreas de operação |
