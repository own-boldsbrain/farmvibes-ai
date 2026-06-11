# PRD — GLAD (Global Land Analysis & Discovery)

## Workflows

- `glad_forest_extent_download.yaml` — Baixa dados de extensão florestal GLAD
- `glad_forest_extent_download_merge.yaml` — Baixa e mescla em um único raster

---

## JTBDs (Jobs To Be Done)

1. **Baixar extensão florestal GLAD** — O usuário precisa de mapas de floresta/não-floresta do Global Land Analysis.
2. **Mesclar em raster único** — O usuário precisa unificar tiles em um único raster classificado.

---

## Casos de Uso

- **C1:** ONG ambiental quer monitorar desmatamento na Amazônia.
- **C2:** Pesquisador calcula métricas de fragmentação florestal.
- **C3:** Governo usa dados GLAD para fiscalização ambiental.

---

## Faz / Não Faz

### Faz

- Listar produtos GLAD via Planetary Computer.
- Baixar dados de extensão florestal.
- Mesclar rasters agrupados por ano.
- Classificar pixels em 0 (não-floresta) e 1 (floresta) seguindo definição FAO.

### Não Faz

- Não detecta mudança florestal (apenas extensão).
- Não suporta outros produtos GLAD.

---

## Users Inputs

| Parâmetro | Workflow | Tipo | Descrição |
|-----------|----------|------|-----------|
| `input_item` | Ambos | geometry | Geometria de interesse |

---

## System Outputs

### `glad_forest_extent_download`

- **sink:** `downloaded_product` — Rasters individuais GLAD.

### `glad_forest_extent_download_merge`

- **sink:** `merged_product` — Raster mesclado.
- **sink:** `categorical_raster` — Raster categórico (0/1).

---

## Outcomes Esperados

- Dados de extensão florestal disponíveis como rasters locais.
- Raster único com classificação floresta (1) / não-floresta (0).

---

## APIs

- **Planetary Computer STAC API**
- **Coleção:** `glad-forest-extent`

---

## CRUD

| Operação | Descrição |
|----------|-----------|
| GET (list) | Lista produtos GLAD |
| GET (download) | Download dos rasters |

---

## Bancos de Dados

- **Externo:** Planetary Computer.
- **Interno:** Rasters GeoTIFF.

---

## Datasets e JSON Files

N/A.

---

## Tabelas

N/A.

---

## Lógicas e Cálculos

- **Classificação:** Pixels com valor 0 = não-floresta; 1 = floresta (definição FAO).
- **Agrupamento:** Por ano (`criterion: "year"`).
- **Merge:** Rasters do mesmo ano são mesclados.
- **Fluxo:** `list_glad_products` → `download_glad` → `group_rasters_by_time` → `merge_rasters`.

---

## Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Mercado de Carbono | REDD+ | Mapa de extensão florestal (floresta/não-floresta) | Baseline para projetos REDD+ de redução de desmatamento |
| Biomassa / Bioenergia | Floresta energética | Classificação de áreas florestais para manejo | Mapa de disponibilidade de biomassa florestal |
| Geração Hidrelétrica | UHE, PCH | Cobertura florestal de cabeceiras e bacias | Dados de vegetação para análise de recarga hídrica |
| Óleo e Gás | Exploração | Monitoramento de desmatamento em concessões | Detecção de mudanças em áreas de operação |
| Geração Solar | GC | Zoneamento ambiental para implantação | Mapa de restrições florestais para licenciamento |
