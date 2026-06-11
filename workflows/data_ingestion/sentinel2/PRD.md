# PRD — Sentinel-2 (Óptico)

## Workflows

- `preprocess_s2.yaml` — Download e pré-processamento padrão S2
- `preprocess_s2_ensemble_masks.yaml` — S2 com máscaras ensemble (5 modelos)
- `preprocess_s2_improved_masks.yaml` — S2 com máscaras melhoradas (modelo único)
- `improve_cloud_mask.yaml` — Melhora máscara de nuvem (modelo único)
- `improve_cloud_mask_ensemble.yaml` — Melhora máscara de nuvem (ensemble)
- `cloud_ensemble.yaml` — Ensemble de 5 modelos de probabilidade de nuvem

---

## JTBDs (Jobs To Be Done)

1. **Baixar e pré-processar S2** — O usuário precisa de rasters S2 L2A multi-bandas a 10m com máscara de nuvem.
2. **Melhorar máscara de nuvem** — O usuário precisa de máscaras mais precisas usando modelos de ML (segmentação).
3. **Ensemble de nuvens** — O usuário quer probabilidade de nuvem combinando múltiplos modelos.

---

## Casos de Uso

- **C1:** Agrônomo analisa NDVI em série temporal S2 sem nuvens.
- **C2:** Pipeline SpaceEye precisa de máscaras de nuvem melhoradas.
- **C3:** Pesquisador treina modelos de classificação com dados S2 limpos.

---

## Faz / Não Faz

### Faz

- Listar produtos S2 no Planetary Computer.
- Selecionar cobertura mínima de tiles.
- Baixar e empilhar bandas a 10m.
- Gerar máscara de nuvem padrão (QA).
- Calcular probabilidade de nuvem/sombra com modelos ONNX.
- Executar ensemble de 5 modelos.
- Mesclar máscaras com a máscara do produto.

### Não Faz

- Não faz correção atmosférica (dados L2A já corrigidos).
- Não classifica usos do solo.
- Não faz detecção de mudanças.

---

## Users Inputs

### `preprocess_s2`

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `min_tile_cover` | float | Cobertura mínima da ROI |
| `max_tiles_per_time` | int | Máx. tiles por data |
| `pc_key` | string | Chave Planetary Computer |
| `dl_timeout` | int | Timeout download |

### `improve_cloud_mask`

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `cloud_thr` | float | Threshold de nuvem |
| `shadow_thr` | float | Threshold de sombra |
| `in_memory` | bool | Carregar raster em RAM |
| `cloud_model` | string | Caminho modelo ONNX nuvem |
| `shadow_model` | string | Caminho modelo ONNX sombra |

### `cloud_ensemble`

- N/A (usa 5 modelos fixos: `cloud_model1_cpu.onnx` a `cloud_model5_cpu.onnx`)

---

## System Outputs

| Workflow | Sink | Descrição |
|----------|------|-----------|
| `preprocess_s2` | `raster` | S2 L2A 10m multi-bandas |
| `preprocess_s2` | `mask` | Máscara de nuvem do produto |
| `preprocess_s2_*_masks` | `raster` | S2 L2A 10m |
| `preprocess_s2_*_masks` | `mask` | Máscara melhorada 10m |
| `improve_cloud_mask*` | `mask` | Máscara de nuvem melhorada |
| `cloud_ensemble` | `cloud_probability` | Mapa de probabilidade de nuvem |

---

## Outcomes Esperados

- Rasters S2 limpos (pixels nublados mascarados) disponíveis localmente.
- Máscaras de nuvem mais precisas que as do produto original.
- Probabilidade de nuvem combinada de múltiplos modelos.

---

## APIs

- **Planetary Computer STAC API**
- **Coleção:** `sentinel-2-l2a`

---

## CRUD

| Operação | Descrição |
|----------|-----------|
| GET (list) | Lista produtos S2 |
| GET (download) | Download e pré-processamento |

---

## Bancos de Dados

- **Externo:** Planetary Computer.
- **Interno:** Rasters GeoTIFF + máscaras.

---

## Datasets e JSON Files

- **S2 L2A:** Bandas espectrais (B1–B12) + SCL + QA.
- **Modelos ONNX:** `cloud_model{1..5}_cpu.onnx`, `shadow.onnx`.

---

## Tabelas

N/A.

---

## Lógicas e Cálculos

- **Seleção de tiles:** `select_necessary_coverage_items` com `min_cover` e `max_items`.
- **Agrupamento:** `group_sentinel2_orbits` por órbita.
- **Merge:** `merge_sentinel2_orbits` combina rasters e máscaras.
- **Probabilidade de nuvem:** Modelo ONNX de segmentação → mapa de probabilidade.
- **Probabilidade de sombra:** Modelo ONNX `shadow.onnx`.
- **Ensemble:** Média das probabilidades de 5 modelos.
- **Máscara final:** `merge_cloud_masks_simple` aplica thresholds e combina com máscara do produto.
- **Fluxo principal:** `list_sentinel2_products_pc` → `select_necessary_coverage_items` → `download_stack_sentinel2` → `group_sentinel2_orbits` → `merge_sentinel2_orbits`.

---

## Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Biomassa / Bioenergia | Cana-de-açúcar, Floresta energética | NDVI e índices multiespectrais a 10m | Monitoramento de culturas bioenergéticas com alta resolução temporal |
| Geração Solar | GD, GC | Máscaras de nuvem e probabilidade | Dados de cobertura de nuvens para irradiância solar |
| Mercado de Carbono | REDD+, Reflorestamento | Classificação multiespectral de cobertura vegetal | Mapeamento de mudanças para créditos de carbono |
| Eficiência Energética | Irrigação | Evapotranspiração via índices espectrais | Estimativa de demanda hídrica em alta resolução |
| Distribuição de Energia | Concessionárias | Monitoramento de vegetação em faixas | Detecção de invasão vegetal em linhas de transmissão |
| Geração Hidrelétrica | UHE, PCH | Monitoramento de reservatórios | Área de lâmina d'água e sedimentação |
