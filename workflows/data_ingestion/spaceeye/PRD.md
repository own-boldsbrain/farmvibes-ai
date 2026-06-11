# PRD — SpaceEye (Remoção de Nuvens)

## Workflows

- `spaceeye.yaml` — Pipeline completo (S1 + S2 + máscaras ensemble)
- `spaceeye_inference.yaml` — Inferência SpaceEye (S1 + S2 + máscaras)
- `spaceeye_interpolation.yaml` — Pipeline com interpolação temporal (S2 apenas)
- `spaceeye_interpolation_inference.yaml` — Inferência por interpolação temporal
- `spaceeye_preprocess.yaml` — Pré-processamento S1 + S2 com máscaras melhoradas
- `spaceeye_preprocess_ensemble.yaml` — Pré-processamento S1 + S2 com máscaras ensemble

---

## JTBDs (Jobs To Be Done)

1. **Remover nuvens de imagens S2** — O usuário precisa de imagens diárias livres de nuvens usando dados S2 + S1 (SpaceEye).
2. **Pré-processar dados para SpaceEye** — O usuário precisa preparar S1, S2 e máscaras de nuvem para o modelo SpaceEye.

---

## Casos de Uso

- **C1:** Agrônomo quer série temporal S2 contínua sem nuvens para monitoramento.
- **C2:** Pipeline de ML precisa de entrada cloud-free.
- **C3:** Pesquisador usa SpaceEye para estudos acadêmicos.

---

## Faz / Não Faz

### Faz

- Pré-processar S2 com máscaras melhoradas/ensemble.
- Pré-processar S1 no grid S2.
- Agrupar dados em janelas espaço-temporais (`duration`, `time_overlap`).
- Executar inferência SpaceEye (remove_clouds / temporal interpolation).
- Dividir sequências inferidas em rasters individuais.

### Não Faz

- Não funciona sem Sentinel-1 (interpolation funciona só com S2).
- Não faz pré-processamento S1 para pipeline interpolation.
- Não suporta dados que não sejam S1/S2.

---

## Users Inputs

| Parâmetro | Workflow | Tipo | Descrição |
|-----------|----------|------|-----------|
| `duration` | Inferência | int | Janela temporal em dias (default: 48) |
| `time_overlap` | Inferência | float | Sobreposição entre janelas (default: 0.5) |
| `min_tile_cover` | Pré-processamento | float | Cobertura mínima |
| `max_tiles_per_time` | Pré-processamento | int | Máx tiles por data |
| `cloud_thr` | Pré-processamento | float | Threshold nuvem |
| `shadow_thr` | Pré-processamento | float | Threshold sombra |
| `pc_key` | Ambos | string | Chave Planetary Computer |
| `user_input` | Ambos | geometry + time range | Região e período |

---

## System Outputs

| Workflow | Sinks | Descrição |
|----------|-------|-----------|
| `spaceeye` | `raster` | Rasters sem nuvem |
| `spaceeye_inference` | `raster` | Rasters sem nuvem |
| `spaceeye_interpolation` | `raster` | Rasters sem nuvem (interpolação) |
| `spaceeye_interpolation_inference` | `raster` | Rasters sem nuvem |
| `spaceeye_preprocess` | `s2_raster`, `s1_raster`, `cloud_mask` | Dados pré-processados |
| `spaceeye_preprocess_ensemble` | `s2_raster`, `s1_raster`, `cloud_mask` | Dados pré-processados |

---

## Outcomes Esperados

- Imagens diárias livres de nuvens para o período e região solicitados.
- Dados pré-processados prontos para inferência SpaceEye.

---

## APIs

- **Planetary Computer STAC API** (via workflows S1/S2 internos)

---

## CRUD

| Operação | Descrição |
|----------|-----------|
| GET (list + download) | Via workflows S1/S2 internos |
| PROCESS (inference) | Remove nuvens via modelo SpaceEye |

---

## Bancos de Dados

- **Externo:** Planetary Computer.
- **Interno:** Rasters S1, S2, máscaras, resultados sem nuvem.

---

## Datasets e JSON Files

- **Modelo SpaceEye:** ONNX para `remove_clouds`.
- **Paper:** [SpaceEye @ arXiv:2106.08408](https://arxiv.org/abs/2106.08408).

---

## Tabelas

N/A.

---

## Lógicas e Cálculos

- **Agrupamento temporal:** `group_s1_tile_sequence`, `group_s2_tile_sequence`, `group_s2cloudmask_tile_sequence` — criam janelas de `duration` dias com `overlap`.
- **Inferência:** `remove_clouds` usa S1 + S2 + máscaras para inpaint nuvens.
- **Interpolação:** `remove_clouds_interpolation` usa apenas S2 + máscaras (damped temporal interpolation).
- **Pós-processamento:** `split_spaceeye_sequence` separa sequências em rasters individuais.
- **Fluxo completo spaceeye:**
  `preprocess` (S2 melhorado + S1) → `spaceeye_inference`.
- **Fluxo interpolation:**
  `preprocess_s2_improved_masks` → `spaceeye_interpolation_inference`.

---

## Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Eficiência Energética | Irrigação, Estufas | Séries temporais S2 sem nuvens | Monitoramento contínuo de culturas para manejo de precisão |
| Biomassa / Bioenergia | Cana-de-açúcar, Floresta energética | NDVI contínuo sem interferência de nuvens | Séries temporais limpas para fenologia de culturas bioenergéticas |
| Geração Solar | GD, GC | Mosaicos S2 sem nuvens para zoneamento | Imagens consistentes para mapeamento de potencial solar |
| Mercado de Carbono | REDD+ | Monitoramento contínuo de cobertura vegetal | Dados diários sem nuvens para detecção de mudanças |
| Distribuição de Energia | Concessionárias | Imagens consistentes para faixa de servidão | Monitoramento remoto sem lacunas de cobertura |
