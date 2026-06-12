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

## Use Cases
1. **Automação**: Recebe `List[SamMaskRaster]` (saída de `automatic_segmentation`) e aplica pipeline de filtragem: NMS intra-chip usando scores do SAM, NMS inter-chip priorizando máscaras menores, e remoção de máscaras que tocam borda do chip e estão contidas em outras de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Faz**: Processa rasters geoespaciais com suporte a múltiplas bandas.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `input_masks` | — | Conforme especificação da operação |
| `List[SamMaskRaster]` | — | Conforme especificação da operação |
| `chip_nms_thr` | — | Conforme especificação da operação |
| `mask_nms_thr` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `segment_anything_combine_masks` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

