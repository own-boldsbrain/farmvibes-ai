# PRD — GEDI (Global Ecosystem Dynamics Investigation)

## Workflows

- `download_gedi.yaml` — Baixa produtos GEDI (LIDAR) da NASA
- `download_gedi_rh100.yaml` — Baixa e extrai variável RH100 dos produtos L2B

---

## JTBDs (Jobs To Be Done)

1. **Baixar produtos GEDI** — O usuário precisa de dados brutos GEDI (LIDAR) nos níveis de processamento 01B, 02A ou 02B.
2. **Extrair RH100** — O usuário precisa extrair a métrica RH100 (altura do dossel) dos produtos L2B e geolocalizar cada feixe.

---

## Casos de Uso

- **C1:** Pesquisador de carbono florestal quer estimar biomassa usando RH100.
- **C2:** Ecologista estuda altura de dossel em florestas tropicais.
- **C3:** Cientista de dados usa GEDI L1B para calibrar modelos de reflectância.

---

## Faz / Não Faz

### Faz

- Listar produtos GEDI via NASA EarthData API.
- Baixar produtos nos níveis GEDI01_B.002, GEDI02_A.002, GEDI02_B.002.
- Extrair RH100 de produtos L2B.
- Geolocalizar cada feixe com latitude/longitude do lowest mode.
- Filtrar por qualidade (`check_quality`).

### Não Faz

- Não calcula métricas além do RH100.
- Não faz correção atmosférica.
- Não suporta outros sensores LIDAR (ICESat, etc.).

---

## Users Inputs

| Parâmetro | Workflow | Tipo | Descrição |
|-----------|----------|------|-----------|
| `earthdata_token` | Ambos | string | Token da API EarthData |
| `processing_level` | `download_gedi` | string | "GEDI01_B.002", "GEDI02_A.002", "GEDI02_B.002" |
| `check_quality` | `download_gedi_rh100` | boolean | Filtro de qualidade |
| `user_input` | Ambos | geometry + time range | Região e período |

---

## System Outputs

### `download_gedi`

- **sink:** `product` — Produtos GEDI brutos.

### `download_gedi_rh100`

- **sink:** `rh100` — Pontos em EPSG:4326 com valores RH100.

---

## Outcomes Esperados

- Dados GEDI disponíveis como assets locais.
- RH100 extraído e geolocalizado para análise de altura de dossel.

---

## APIs

- **NASA EarthData API:** `https://cmr.earthdata.nasa.gov`
- **Autenticação:** Token EarthData (`earthdata_token`)

---

## CRUD

| Operação | Descrição |
|----------|-----------|
| GET (list) | Lista produtos GEDI disponíveis |
| GET (download) | Download dos produtos HDF5 |

---

## Bancos de Dados

- **Externo:** NASA EarthData / LP DAAC.
- **Interno:** Produtos HDF5 e pontos GeoJSON/Parquet com RH100.

---

## Datasets e JSON Files

- **Produtos:** Arquivos HDF5.
- **RH100:** Tabela de pontos com latitude, longitude e valor RH100.

---

## Tabelas

| Coluna | Descrição |
|--------|-----------|
| `latitude` | Latitude do lowest mode |
| `longitude` | Longitude do lowest mode |
| `rh100` | Altura relativa do percentil 100 |
| `quality_flag` | Indicador de qualidade |

---

## Lógicas e Cálculos

- **Extração RH100:** Para cada `beam shot`, extrai o valor RH100 e as coordenadas do lowest mode.
- **Filtro de qualidade:** Se `check_quality` = true, remove pontos com baixa qualidade.
- **Fluxo:** `download_gedi` → `product` → `extract_gedi_rh100`.

---

## Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Mercado de Carbono | REDD+, Reflorestamento | Altura do dossel (RH100) para biomassa acima do solo | Estimativa de estoque de carbono florestal para créditos |
| Biomassa / Bioenergia | Floresta energética | Altura de dossel para estimativa de volume lenhoso | Dados LIDAR para cálculo de biomassa disponível |
| Geração Hidrelétrica | UHE, PCH | Cobertura vegetal de bacias hidrográficas | Altura de dossel para modelagem hidrológica e evapotranspiração |
| Óleo e Gás | Exploração | Baseline ambiental para licenciamento | Dados de estrutura de vegetação para EIA/RIMA |
| Geração Solar | GC | Remoção de vegetação para implantação | Baseline de biomassa para compensação ambiental |
