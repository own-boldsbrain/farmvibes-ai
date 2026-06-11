# JTBDs (Segment Anything Combine Masks)

## JTBDs
1. Combinar múltiplas máscaras SAM de diferentes chips em uma única máscara consolidada
2. Remover duplicatas via NMS entre máscaras intra-chip e inter-chip

## Descrição
Recebe `List[SamMaskRaster]` (saída de `automatic_segmentation`) e aplica pipeline de filtragem: NMS intra-chip usando scores do SAM, NMS inter-chip priorizando máscaras menores, e remoção de máscaras que tocam borda do chip e estão contidas em outras. Máscaras resultantes são mescladas em um único `CategoricalRaster`.

## Inputs
- `input_masks`: `List[SamMaskRaster]`
- Parâmetros: `chip_nms_thr`, `mask_nms_thr`

## Outputs
- `output_mask`: `CategoricalRaster`

## Lógicas e Cálculos
- `batched_nms` intra-chip: `iou_threshold=chip_nms_thr`, scores = SAM `mask_score`
- `batched_nms` inter-chip: `iou_threshold=mask_nms_thr`, scores = `1 / box_area` (prefere máscaras menores)
- Remove máscaras que tocam `chip_window` boundary E estão contidas em máscaras de outros chips
- `merge_masks`: escreve bandas selecionadas no GeoTIFF de saída, `count = n_masks`
