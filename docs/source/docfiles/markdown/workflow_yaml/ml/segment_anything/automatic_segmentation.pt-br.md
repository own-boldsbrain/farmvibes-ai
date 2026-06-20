# ml/segment_anything/automatic_segmentation

Executa uma segmentação automática do Segment Anything Model (SAM) sobre rasters de entrada. O fluxo de trabalho (workflow) divide os rasters de entrada em fragmentos (chips) de 1024x1024 pixels com uma sobreposição definida por `spatial_overlap`. Cada fragmento é processado pelo codificador de imagem (image encoder) do SAM, e uma grade de pontos é definida dentro de cada fragmento, com cada ponto sendo usado como um prompt para a segmentação. Cada ponto é usado para gerar uma máscara, e as máscaras são combinadas usando múltiplas etapas de supressão não máxima para gerar a máscara de segmentação final. Antes de executar o fluxo de trabalho, certifique-se de que o modelo foi importado para o cluster executando `scripts/export_prompt_segmentation_models.py`. O script baixará os pesos do modelo desejado do repositório do SAM, exportará o codificador de imagem e o decodificador de máscara para o formato ONNX e os adicionará ao cluster. Para mais informações, consulte a página de [solução de problemas do FarmVibes.AI](https://microsoft.github.io/farmvibes-ai/docfiles/markdown/TROUBLESHOOTING.html) na documentação.

```{mermaid}
    graph TD
    inp1>input_raster]
    inp2>input_geometry]
    out1>segmentation_mask]
    tsk1{{clip}}
    tsk2{{sam_inference}}
    tsk3{{combine_masks}}
    tsk1{{clip}} -- clipped_raster/input_raster --> tsk2{{sam_inference}}
    tsk2{{sam_inference}} -- segmented_chips/input_masks --> tsk3{{combine_masks}}
    inp1>input_raster] -- raster --> tsk1{{clip}}
    inp2>input_geometry] -- input_geometry --> tsk1{{clip}}
    tsk3{{combine_masks}} -- output_mask --> out1>segmentation_mask]
```

## Fontes (Sources)

- **input_raster**: Rasters usados como entrada para a segmentação.

- **input_geometry**: Geometria de interesse dentro do raster para a segmentação.

## Sinks (Saídas)

- **segmentation_mask**: Máscaras de segmentação de saída.

## Parâmetros

- **model_type**: Arquitetura da espinha dorsal (backbone) do codificador de imagem do SAM, entre 'vit_h', 'vit_l' ou 'vit_b'. Antes de executar o fluxo de trabalho, certifique-se de que o modelo desejado foi exportado para o cluster executando `scripts/export_sam_models.py`. Para mais informações, consulte a página de solução de problemas do FarmVibes.AI na documentação.

- **band_names**: Nome das bandas de raster que devem ser selecionadas para compor as imagens de 3 canais esperadas pelo SAM. Se não for fornecido, tentará usar ["R", "G", "B"]. Se apenas um único nome de banda for fornecido, ele será replicado em todos os três canais.

- **band_scaling**: Uma lista de números decimais (floats) para dimensionar cada banda para o intervalo de [0.0, 1.0] ou [0.0, 255.0]. Se não for fornecido, o padrão será o parâmetro de dimensionamento do raster. Se uma lista com um único valor for fornecida, ela será usada para as três bandas.

- **band_offset**: Uma lista de números decimais para compensar (offset) cada banda. Se não for fornecido, o padrão será o valor de compensação do raster. Se uma lista com um único valor for fornecida, ela será usada para as três bandas.

- **spatial_overlap**: Porcentagem de sobreposição espacial entre fragmentos no intervalo de [0.0, 1.0).

- **points_per_side**: O número de pontos a serem amostrados ao longo de um lado do fragmento para serem prompts. O número total de pontos é points_per_side\*\*2.

- **n_crop_layers**: Se >0, a previsão de máscara será executada novamente em recortes (crops) da imagem. Define o número de camadas a serem executadas, onde cada camada tem 2\*\*i_layer número de recortes de imagem.

- **crop_overlap_ratio**: Define o grau em que os recortes se sobrepõem. Na primeira camada de recorte, os recortes se sobreporão por esta fração do comprimento do fragmento. Camadas posteriores com mais recortes reduzem essa sobreposição.

- **crop_n_points_downscale_factor**: O número de pontos por lado amostrados na camada n é reduzido por crop_n_points_downscale_factor\*\*n.

- **pred_iou_thresh**: Um limiar de filtragem em [0,1] sobre a qualidade/pontuação da máscara prevista pelo modelo.

- **stability_score_thresh**: Um limiar de filtragem em [0,1], usando a estabilidade da máscara sob mudanças no corte usado para binarizar as previsões de máscara do modelo.

- **stability_score_offset**: A quantidade para deslocar o corte ao calcular a pontuação de estabilidade.

- **points_per_batch**: Número de pontos a serem processados em um único lote (batch).

- **num_workers**: Número de trabalhadores a serem usados para processamento paralelo.

- **in_memory**: Se deve carregar todo o raster na memória ao executar previsões. Usa mais memória (~4GB/trabalhador), mas acelera a inferência para modelos rápidos.

- **chip_nms_thr**: O corte de IoU da caixa usado pela supressão não máxima para filtrar máscaras duplicadas dentro de um fragmento.

- **mask_nms_thr**: O corte de IoU da caixa usado pela supressão não máxima para filtrar máscaras duplicadas entre fragmentos diferentes.

## Tarefas (Tasks)

- **clip**: Realiza um recorte (clip) em um raster de entrada com base em uma geometria de referência fornecida.

- **sam_inference**: Executa uma inferência de segmentação automática do SAM sobre o raster de entrada, gerando máscaras para cada fragmento.

- **combine_masks**: Processa máscaras de segmentação intermediárias, filtrando duplicatas e combinando em um raster de máscara final.

## Workflow Yaml

```yaml
name: automatic_segmentation
sources:
  input_raster:
    - clip.raster
  input_geometry:
    - clip.input_geometry
sinks:
  segmentation_mask: combine_masks.output_mask
parameters:
  model_type: vit_b
  band_names: null
  band_scaling: null
  band_offset: null
  spatial_overlap: 0.5
  points_per_side: 16
  n_crop_layers: 0
  crop_overlap_ratio: 0.0
  crop_n_points_downscale_factor: 1
  pred_iou_thresh: 0.88
  stability_score_thresh: 0.95
  stability_score_offset: 1.0
  points_per_batch: 16
  num_workers: 0
  in_memory: true
  chip_nms_thr: 0.7
  mask_nms_thr: 0.5
tasks:
  clip:
    workflow: data_processing/clip/clip
  sam_inference:
    op: automatic_segmentation
    op_dir: segment_anything
    parameters:
      model_type: "@from(model_type)"
      band_names: "@from(band_names)"
      band_scaling: "@from(band_scaling)"
      band_offset: "@from(band_offset)"
      spatial_overlap: "@from(spatial_overlap)"
      points_per_side: "@from(points_per_side)"
      n_crop_layers: "@from(n_crop_layers)"
      crop_overlap_ratio: "@from(crop_overlap_ratio)"
      crop_n_points_downscale_factor: "@from(crop_n_points_downscale_factor)"
      pred_iou_thresh: "@from(pred_iou_thresh)"
      stability_score_thresh: "@from(stability_score_thresh)"
      stability_score_offset: "@from(stability_score_offset)"
      points_per_batch: "@from(points_per_batch)"
      num_workers: "@from(num_workers)"
      in_memory: "@from(in_memory)"
  combine_masks:
    op: combine_sam_masks
    op_dir: segment_anything_combine_masks
    parameters:
      chip_nms_thr: "@from(chip_nms_thr)"
      mask_nms_thr: "@from(mask_nms_thr)"
edges:
  - origin: clip.clipped_raster
    destination:
      - sam_inference.input_raster
  - origin: sam_inference.segmented_chips
    destination:
      - combine_masks.input_masks
description:
  short_description: Executa uma segmentação automática do Segment Anything Model (SAM) sobre rasters de entrada.
  long_description: O fluxo de trabalho divide os rasters de entrada em fragmentos de 1024x1024 pixels com uma sobreposição definida por `spatial_overlap`. Cada fragmento é processado pelo codificador de imagem do SAM, e uma grade de pontos é definida dentro de cada fragmento, com cada ponto sendo usado como um prompt para a segmentação. Cada ponto é usado para gerar uma máscara, e as máscaras são combinadas usando múltiplas etapas de supressão não máxima para gerar a máscara de segmentação final. Antes de executar o fluxo de trabalho, certifique-se de que o modelo foi importado para o cluster executando `scripts/export_prompt_segmentation_models.py`. O script baixará os pesos do modelo desejado do repositório do SAM, exportará o codificador de imagem e o decodificador de máscara para o formato ONNX e os adicionará ao cluster. Para mais informações, consulte a página de [solução de problemas do FarmVibes.AI](https://microsoft.github.io/farmvibes-ai/docfiles/markdown/TROUBLESHOOTING.html) na documentação.
  sources:
    input_raster: Rasters usados como entrada para a segmentação.
    input_geometry: Geometria de interesse dentro do raster para a segmentação.
  sinks:
    segmentation_mask: Máscaras de segmentação de saída.
```
