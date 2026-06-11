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
