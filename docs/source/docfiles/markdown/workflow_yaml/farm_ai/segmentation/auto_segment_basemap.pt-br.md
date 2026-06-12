# farm_ai/segmentation/auto_segment_basemap

Baixa o mapa base (basemap) com a API do BingMaps e executa a segmentação automática do Segment Anything Model (SAM) sobre ele. O fluxo de trabalho (workflow) lista e baixa as peças (tiles) do mapa base com a API do BingMaps e as mescla em um único raster. O raster é então dividido em fragmentos (chips) de 1024x1024 pixels com uma sobreposição definida por `spatial_overlap`. Cada fragmento é processado pelo codificador de imagem (image encoder) do SAM, e uma grade de pontos é definida dentro de cada fragmento, com cada ponto sendo usado como um prompt para a segmentação. Cada ponto é usado para gerar uma máscara, e as máscaras são combinadas usando múltiplas etapas de supressão não máxima para gerar a máscara de segmentação final. Antes de executar o fluxo de trabalho, certifique-se de que o modelo foi importado para o cluster executando `scripts/export_prompt_segmentation_models.py`. O script baixará os pesos do modelo desejado do repositório do SAM, exportará o codificador de imagem e o decodificador de máscara para o formato ONNX e os adicionará ao cluster. Para mais informações, consulte a página de [solução de problemas do FarmVibes.AI](https://microsoft.github.io/farmvibes-ai/docfiles/markdown/TROUBLESHOOTING.html) na documentação.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>basemap]
    out2>segmentation_mask]
    tsk1{{basemap_download}}
    tsk2{{basemap_automatic_segmentation}}
    tsk1{{basemap_download}} -- merged_basemap/input_raster --> tsk2{{basemap_automatic_segmentation}}
    inp1>user_input] -- input_geometry --> tsk1{{basemap_download}}
    inp1>user_input] -- input_geometry --> tsk2{{basemap_automatic_segmentation}}
    tsk1{{basemap_download}} -- merged_basemap --> out1>basemap]
    tsk2{{basemap_automatic_segmentation}} -- segmentation_mask --> out2>segmentation_mask]
```

## Fontes (Sources)

- **user_input**: Intervalo de tempo e geometria de interesse.

## Sinks (Saídas)

- **basemap**: Mapa base mesclado usado como entrada para a segmentação.

- **segmentation_mask**: Máscaras de segmentação de saída.

## Parâmetros

- **bingmaps_api_key**: Chave de API do BingMaps obrigatória.

- **basemap_zoom_level**: Nível de zoom de interesse, variando de 0 a 20. Por exemplo, um nível de zoom de 1 corresponde a uma resolução de 78271,52 m/pixel, um nível de zoom de 10 corresponde a 152,9 m/pixel e um nível de zoom de 19 corresponde a 0,3 m/pixel. Para mais informações sobre níveis de zoom e sua escala e resolução correspondentes, consulte a documentação da API do BingMaps em https://learn.microsoft.com/en-us/bingmaps/articles/understanding-scale-and-resolution

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

- **basemap_download**: Baixa as peças do mapa base do Bing Maps e as mescla em um único raster.

- **basemap_automatic_segmentation**: Executa uma segmentação automática do Segment Anything Model (SAM) sobre rasters de entrada.

## Workflow Yaml

```yaml

name: auto_segment_basemap
sources:
  user_input:
  - basemap_download.input_geometry
  - basemap_automatic_segmentation.input_geometry
sinks:
  basemap: basemap_download.merged_basemap
  segmentation_mask: basemap_automatic_segmentation.segmentation_mask
parameters:
  bingmaps_api_key: null
  basemap_zoom_level: 14
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
  basemap_download:
    workflow: data_ingestion/bing/basemap_download_merge
    parameters:
      api_key: '@from(bingmaps_api_key)'
      zoom_level: '@from(basemap_zoom_level)'
  basemap_automatic_segmentation:
    workflow: ml/segment_anything/automatic_segmentation
    parameters:
      model_type: '@from(model_type)'
      band_names:
      - red
      - green
      - blue
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
- origin: basemap_download.merged_basemap
  destination:
  - basemap_automatic_segmentation.input_raster
description:
  short_description: Baixa o mapa base com a API do BingMaps e executa a segmentação automática do Segment Anything Model (SAM) sobre ele.
  long_description: O fluxo de trabalho lista e baixa as peças do mapa base com a API do BingMaps e as mescla em um único raster. O raster é então dividido em fragmentos de 1024x1024 pixels com uma sobreposição definida por `spatial_overlap`. Cada fragmento é processado pelo codificador de imagem do SAM, e uma grade de pontos é definida dentro de cada fragmento, com cada ponto sendo usado como um prompt para a segmentação. Cada ponto é usado para gerar uma máscara, e as máscaras são combinadas usando múltiplas etapas de supressão não máxima para gerar a máscara de segmentação final. Antes de executar o fluxo de trabalho, certifique-se de que o modelo foi importado para o cluster executando `scripts/export_prompt_segmentation_models.py`. O script baixará os pesos do modelo desejado do repositório do SAM, exportará o codificador de imagem e o decodificador de máscara para o formato ONNX e os adicionará ao cluster. Para mais informações, consulte a página de [solução de problemas do FarmVibes.AI](https://microsoft.github.io/farmvibes-ai/docfiles/markdown/TROUBLESHOOTING.html) na documentação.
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    basemap: Mapa base mesclado usado como entrada para a segmentação.
    segmentation_mask: Máscaras de segmentação de saída.


```