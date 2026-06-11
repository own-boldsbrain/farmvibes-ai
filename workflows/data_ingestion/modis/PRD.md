# PRD — MODIS (Moderate Resolution Imaging Spectroradiometer)

## Workflows
- `download_modis_surface_reflectance.yaml` — Baixa reflectância de superfície MODIS (8 dias)
- `download_modis_vegetation_index.yaml` — Baixa índices de vegetação MODIS (16 dias)

---

## JTBDs (Jobs To Be Done)

1. **Baixar reflectância MODIS** — O usuário precisa de rasters de reflectância de superfície (bandas 1, 2 + QC) a cada 8 dias, em 250m ou 500m.
2. **Baixar índices de vegetação MODIS** — O usuário precisa de NDVI ou EVI a cada 16 dias, em 250m ou 500m.

---

## Casos de Uso

- **C1:** Agrônomo quer série temporal de NDVI para monitorar safra.
- **C2:** Ecologista estuda produtividade primária usando EVI.
- **C3:** Hidrólogo usa reflectância MODIS para estimar evapotranspiração.

---

## Faz / Não Faz

### Faz
- Baixar reflectância MODIS (MODO9Q1 - 250m, MOD09A1 - 500m).
- Baixar índices de vegetação (MOD13Q1 - 250m, MOD13A1 - 500m).
- Selecionar pixels com baixa cobertura de nuvens.
- Suportar resoluções 250m e 500m.

### Não Faz
- Não faz correção atmosférica adicional.
- Não calcula outros índices (SAVI, GNDVI).
- Não interpola dados faltantes.

---

## Users Inputs

### `download_modis_surface_reflectance`
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `pc_key` | string | Chave opcional Planetary Computer |
| `resolution_m` | int | 250 ou 500 metros |
| `user_input` | geometry + time range | Região e período |

### `download_modis_vegetation_index`
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `index` | string | "evi" ou "ndvi" |
| `pc_key` | string | Chave opcional Planetary Computer |
| `resolution_m` | int | 250 ou 500 metros |
| `user_input` | geometry + time range | Região e período |

---

## System Outputs

### Reflectância
- **sink:** `raster` — Rasters com bandas de reflectância e quality control.

### Índice de Vegetação
- **sink:** `index` — Raster com NDVI ou EVI.

---

## Outcomes Esperados

- Dados MODIS disponíveis como rasters locais na resolução e índice escolhidos.
- Série temporal consistente (8 ou 16 dias).

---

## APIs

- **Planetary Computer STAC API**
- **Coleções:** `modis-09Q1-061`, `modis-09A1-061`, `modis-13Q1-061`, `modis-13A1-061`

---

## CRUD

| Operação | Descrição |
|----------|-----------|
| GET (list) | Lista produtos MODIS |
| GET (download) | Download dos rasters |

---

## Bancos de Dados

- **Externo:** Planetary Computer.
- **Interno:** Rasters GeoTIFF.

---

## Datasets e JSON Files

- **MOD09Q1/MOD09A1:** Reflectância 8 dias, bandas 1 e 2 + QC.
- **MOD13Q1/MOD13A1:** Índices de vegetação 16 dias, NDVI/EVI + QA.

---

## Tabelas

N/A.

---

## Lógicas e Cálculos

- **Seleção de pixels:** Valores selecionados baseados em baixa cobertura de nuvens, baixo ângulo de visão e maior valor do índice.
- **Resolução:** Define o produto (250m → Q1, 500m → A1).
- **Fluxo reflectância:** `list_modis_sr` → `download_modis_sr`.
- **Fluxo índice:** `list_modis_vegetation` → `download_modis_vegetation`.

---

## Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Biomassa / Bioenergia | Cana-de-açúcar, Floresta energética | NDVI/EVI em séries temporais (16 dias) | Monitoramento fenológico de culturas para bioenergia |
| Geração Solar | GC | Cobertura de nuvens e reflectância de superfície | Histórico de irradiância para prospecção solar |
| Geração Hidrelétrica | UHE, PCH | Produtividade primária e evapotranspiração | Dados de reflectância para modelos hidrológicos |
| Eficiência Energética | Irrigação | Evapotranspiração via reflectância | Estimativa de consumo hídrico em escala regional |
| Mercado de Carbono | REDD+ | Produtividade primária líquida (NPP) | Dados de entrada para modelagem de carbono |
