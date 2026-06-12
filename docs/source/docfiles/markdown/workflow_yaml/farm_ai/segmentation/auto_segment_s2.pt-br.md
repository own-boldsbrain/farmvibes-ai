# farm_ai/segmentation/auto_segment_s2

Baixa imagens do Sentinel-2 e executa a segmentação automática do Segment Anything Model (SAM) sobre elas. O fluxo de trabalho (workflow) recupera os produtos Sentinel-2 relevantes com a API do Planetary Computer (PC) e divide os rasters de entrada em fragmentos (chips) de 1024x1024 pixels com uma sobreposição definida por `spatial_overlap`. Cada fragmento é processado pelo codificador de imagem (image encoder) do SAM, e uma grade de pontos é definida dentro de cada fragmento, com cada ponto sendo usado como um prompt para a segmentação. Cada ponto é usado para gerar uma máscara, e as máscaras são combinadas usando múltiplas etapas de supressão não máxima para gerar a máscara de segmentação final. Antes de executar o fluxo de trabalho, certifique-se de que o modelo foi importado para o cluster executando `scripts/export_prompt_segmentation_models.py`. O script baixará os pesos do modelo desejado do repositório do SAM, exportará o codificador de imagem e o decodificador de máscara para o formato ONNX e os adicionará ao cluster. Para mais informações, consulte a página de [solução de problemas do FarmVibes.AI](https://microsoft.github.io/farmvibes-ai/docfiles/markdown/TROUBLESHOOTING.html) na documentação.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>s2_raster]
    out2>segmentation_mask]
    tsk1{{preprocess_s2}}
    tsk2{{s2_automatic_segmentation}}
    tsk1{{preprocess_s2}} -- raster/input_raster --> tsk2{{s2_automatic_segmentation}}
    inp1>user_input] -- user_input --> tsk1{{preprocess_s2}}
    inp1>user_input] -- input_geometry --> tsk2{{s2_automatic_segmentation}}
    tsk1{{preprocess_s2}} -- raster --> out1>s2_raster]
    tsk2{{s2_automatic_segmentation}} -- segmentation_mask --> out2>segmentation_mask]
```

## Fontes (Sources)

- **user_input**: Intervalo de tempo e geometria de interesse.

## Sinks (Saídas)

- **s2_raster**: Rasters Sentinel-2 usados como entrada para a segmentação.

- **segmentation_mask**: Máscaras de segmentação de saída.

## Parâmetros

- **pc_key**: Chave de API opcional do Planetary Computer.

- **model_type**: Arquitetura da espinha dorsal (backbone) do codificador de imagem do SAM, entre 'vit_h', 'vit_l' ou 'vit_b'. Antes de executar o fluxo de trabalho, certifique-se de que o modelo desejado foi exportado para o cluster executando `scripts/export_sam_models.py`. Para mais informações, consulte a página de solução de problemas do FarmVibes.AI na documentação.

- **spatial_overlap**: Porcentagem de sobreposição espacial entre fragmentos no intervalo de [0.0, 1.0).

- **points_per_side**: O número de pontos a serem amostrados ao longo de um lado do fragmento para serem prompts. O número total de pontos é points_per_side**2.

- **n_crop_layers**: Se >0, a previsão de máscara será executada novamente em recortes (crops) da imagem. Define o número de camadas a serem executadas, onde cada camada tem 2**i_layer número de recortes de imagem.

- **crop_overlap_ratio**: Define o grau em que os recortes se sobrepõem. Na primeira camada de recorte, os recortes se sobreporão por esta fração do comprimento do fragmento. Camadas posteriores com mais recortes reduzem essa sobreposição.

- **crop_n_points_downscale_factor**: O número de pontos por lado amostrados na camada n é reduzido por crop_n_points_downscale_factor**n.

- **pred_iou_thresh**: Um limiar de filtragem em [0,1] sobre a qualidade/pontuação da máscara prevista pelo modelo.

- **stability_score_thresh**: Um limiar de filtragem em [0,1], usando a estabilidade da máscara sob mudanças no corte usado para binarizar as previsões de máscara do modelo.

- **stability_score_offset**: A quantidade para deslocar o corte ao calcular a pontuação de estabilidade.

- **points_per_batch**: Número de pontos a serem processados em um único lote (batch).

- **num_workers**: Número de trabalhadores a serem usados para processamento paralelo.

- **in_memory**: Se deve carregar todo o raster na memória ao executar previsões. Usa mais memória (~4GB/trabalhador), mas acelera a inferência para modelos rápidos.

- **chip_nms_thr**: O corte de IoU da caixa usado pela supressão não máxima para filtrar máscaras duplicadas dentro de um fragmento.

- **mask_nms_thr**: O corte de IoU da caixa usado pela supressão não máxima para filtrar máscaras duplicadas entre fragmentos diferentes.

## Tarefas (Tasks)

- **preprocess_s2**: Baixa e pré-processa imagens do Sentinel-2 que cobrem a geometria e o intervalo de tempo de entrada.

- **s2_automatic_segmentation**: Executa uma segmentação automática do Segment Anything Model (SAM) sobre rasters de entrada.

## Workflow Yaml

```yaml

name: auto_segment_s2
sources:
  user_input:
  - preprocess_s2.user_input
  - s2_automatic_segmentation.input_geometry
sinks:
  s2_raster: preprocess_s2.raster
  segmentation_mask: s2_automatic_segmentation.segmentation_mask
parameters:
  pc_key: null
  model_type: vit_b
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
  preprocess_s2:
    workflow: data_ingestion/sentinel2/preprocess_s2
    parameters:
      pc_key: '@from(pc_key)'
  s2_automatic_segmentation:
    workflow: ml/segment_anything/automatic_segmentation
    parameters:
      model_type: '@from(model_type)'
      band_names:
      - R
      - G
      - B
      band_scaling: null
      band_offset: null
      spatial_overlap: '@from(spatial_overlap)'
      points_per_side: '@from(points_per_side)'
      n_crop_layers: '@from(n_crop_layers)'
      crop_overlap_ratio: '@from(crop_overlap_ratio)'
      crop_n_points_downscale_factor: '@from(crop_n_points_downscale_factor)'
      pred_iou_thresh: '@from(pred_iou_thresh)'
      stability_score_thresh: '@from(stability_score_thresh)'
      stability_score_offset: '@from(stability_score_offset)'
      points_per_batch: '@from(points_per_batch)'
      num_workers: '@from(num_workers)'
      in_memory: '@from(in_memory)'
      chip_nms_thr: '@from(chip_nms_thr)'
      mask_nms_thr: '@from(mask_nms_thr)'
edges:
- origin: preprocess_s2.raster
  destination:
  - s2_automatic_segmentation.input_raster
description:
  short_description: Baixa imagens do Sentinel-2 e executa a segmentação automática do Segment Anything Model (SAM) sobre elas.
  long_description: O fluxo de trabalho recupera os produtos Sentinel-2 relevantes com a API do Planetary Computer (PC) e divide os rasters de entrada em fragmentos de 1024x1024 pixels com uma sobreposição definida por `spatial_overlap`. Cada fragmento é processado pelo codificador de imagem do SAM, e uma grade de pontos é definida dentro de cada fragmento, com cada ponto sendo usado como um prompt para a segmentação. Cada ponto é usado para gerar uma máscara, e as máscaras são combinadas usando múltiplas etapas de supressão não máxima para gerar a máscara de segmentação final. Antes de executar o fluxo de trabalho, certifique-se de que o modelo foi importado para o cluster executando `scripts/export_prompt_segmentation_models.py`. O script baixará os pesos do modelo desejado do repositório do SAM, exportará o codificador de imagem e o decodificador de máscara para o formato ONNX e os adicionará ao cluster. Para mais informações, consulte a página de [solução de problemas do FarmVibes.AI](https://microsoft.github.io/farmvibes-ai/docfiles/markdown/TROUBLESHOOTING.html) na documentação.
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    s2_raster: Rasters Sentinel-2 usados como entrada para a segmentação.
    segmentation_mask: Máscaras de segmentação de saída.


```