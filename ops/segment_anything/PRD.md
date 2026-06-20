# JTBDs (Segment Anything)

## JTBDs

1. Segmentar imagens de satélite usando SAM (Segment Anything Model) de forma automática ou por prompts
2. Gerar máscaras de segmentação com scores de qualidade e bounding boxes

## Descrição

Duas modalidades: `automatic_segmentation` (grade de pontos regular) e `prompt_segmentation` (geometrias de entrada como prompts). Carrega modelo SAM encoder/decoder ONNX, recorta raster em chips, extrai embeddings e decodifica máscaras. Filtra por `pred_iou_thresh`, `stability_score_thresh` e NMS entre crops.

## Inputs

- `input_raster`: `Raster`
- (`prompt_segmentation`): `input_prompts`: `GeometryCollection`
- Parâmetros: `model_type`, `points_per_side`, `n_crop_layers`, `pred_iou_thresh`, `stability_score_thresh`, `band_names`, `band_scaling` etc.

## Outputs

- (`automatic`): `segmented_chips`: `List[SamMaskRaster]`
- (`prompt`): `segmentation_mask`: `CategoricalRaster`

## Lógicas e Cálculos

- `extract_img_embeddings_from_chip`: pré-processa chip (seleção de bandas, scaling, padding) → encoder ONNX
- `point_grid_inference`: para cada ponto, decoder ONNX → máscara, filtro por `pred_iou_thresh` e `stability_score_thresh`
- `process_crop`: crops adicionais com `crop_n_points_downscale_factor` por layer
- `generate_masks_from_grid`: itera batches/chips, escreve máscaras em GeoTIFF
- Cada `SamMaskRaster` armazena `mask_score`, `mask_bbox` e `chip_window` para pós-processamento

## Use Cases

1. **Automação**: Duas modalidades: `automatic_segmentation` (grade de pontos regular) e `prompt_segmentation` (geometrias de entrada como prompts) de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Faz**: Processa rasters geoespaciais com suporte a múltiplas bandas.
- **Faz**: Suporte a geometrias delimitadoras para recorte espacial.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável                 | Tipo | Descrição                          |
| ------------------------ | ---- | ---------------------------------- |
| `input_raster`           | —    | Conforme especificação da operação |
| `prompt_segmentation`    | —    | Conforme especificação da operação |
| `input_prompts`          | —    | Conforme especificação da operação |
| `model_type`             | —    | Conforme especificação da operação |
| `points_per_side`        | —    | Conforme especificação da operação |
| `n_crop_layers`          | —    | Conforme especificação da operação |
| `pred_iou_thresh`        | —    | Conforme especificação da operação |
| `stability_score_thresh` | —    | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Lista de produtos disponíveis com metadados completos.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `segment_anything` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **ONNX Runtime**: Inferência de modelos de machine learning.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.
