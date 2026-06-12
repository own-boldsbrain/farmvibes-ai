# farm_ai/segmentation/segment_basemap

Baixa o mapa base (basemap) com a API do BingMaps e executa o Segment Anything Model (SAM) sobre ele com pontos e/ou caixas delimitadoras (bounding boxes) como prompts. O fluxo de trabalho (workflow) lista e baixa as peças (tiles) do mapa base com a API do BingMaps e as mescla em um único raster. O raster é então dividido em fragmentos (chips) de 1024x1024 pixels com uma sobreposição definida por `spatial_overlap`. Os fragmentos que intersectam com os prompts são processados pelo codificador de imagem (image encoder) do SAM, seguido pelo codificador de prompt (prompt encoder) e decodificador de máscara (mask decoder). Antes de executar o fluxo de trabalho, certifique-se de que o modelo foi importado para o cluster executando `scripts/export_prompt_segmentation_models.py`. O script baixará os pesos do modelo desejado do repositório do SAM, exportará o codificador de imagem e o decodificador de máscara para o formato ONNX e os adicionará ao cluster. Para mais informações, consulte a página de [solução de problemas do FarmVibes.AI](https://microsoft.github.io/farmvibes-ai/docfiles/markdown/TROUBLESHOOTING.html) na documentação.

```{mermaid}
    graph TD
    inp1>user_input]
    inp2>prompts]
    out1>basemap]
    out2>segmentation_mask]
    tsk1{{basemap_download}}
    tsk2{{basemap_segmentation}}
    tsk1{{basemap_download}} -- merged_basemap/input_raster --> tsk2{{basemap_segmentation}}
    inp1>user_input] -- input_geometry --> tsk1{{basemap_download}}
    inp1>user_input] -- input_geometry --> tsk2{{basemap_segmentation}}
    inp2>prompts] -- input_prompts --> tsk2{{basemap_segmentation}}
    tsk1{{basemap_download}} -- merged_basemap --> out1>basemap]
    tsk2{{basemap_segmentation}} -- segmentation_mask --> out2>segmentation_mask]
```

## Fontes (Sources)

- **user_input**: Intervalo de tempo e geometria de interesse.

- **prompts**: Referências externas (ExternalReferences) para os prompts de ponto e/ou caixa delimitadora. Estes são GeoJSON com coordenadas, rótulo (primeiro plano/plano de fundo) e id do prompt (caso o raster contenha múltiplas entidades que devam ser segmentadas em uma única execução do fluxo de trabalho).

## Sinks (Saídas)

- **basemap**: Mapa base mesclado usado como entrada para a segmentação.

- **segmentation_mask**: Máscaras de segmentação de saída.

## Parâmetros

- **bingmaps_api_key**: Chave de API do BingMaps obrigatória.

- **basemap_zoom_level**: Nível de zoom de interesse, variando de 0 a 20. Por exemplo, um nível de zoom de 1 corresponde a uma resolução de 78271,52 m/pixel, um nível de zoom de 10 corresponde a 152,9 m/pixel e um nível de zoom de 19 corresponde a 0,3 m/pixel. Para mais informações sobre níveis de zoom e sua escala e resolução correspondentes, consulte a documentação da API do BingMaps em https://learn.microsoft.com/en-us/bingmaps/articles/understanding-scale-and-resolution

- **model_type**: Arquitetura da espinha dorsal (backbone) do codificador de imagem do SAM, entre 'vit_h', 'vit_l' ou 'vit_b'. Antes de executar o fluxo de trabalho, certifique-se de que o modelo desejado foi exportado para o cluster executando `scripts/export_sam_models.py`. Para mais informações, consulte a página de solução de problemas do FarmVibes.AI na documentação.

- **spatial_overlap**: Porcentagem de sobreposição espacial entre fragmentos no intervalo de [0.0, 1.0).

## Tarefas (Tasks)

- **basemap_download**: Baixa as peças do mapa base do Bing Maps e as mescla em um único raster.

- **basemap_segmentation**: Executa o Segment Anything Model (SAM) sobre rasters de entrada com pontos e/ou caixas delimitadoras como prompts.

## Workflow Yaml

```yaml

name: segment_basemap
sources:
  user_input:
  - basemap_download.input_geometry
  - basemap_segmentation.input_geometry
  prompts:
  - basemap_segmentation.input_prompts
sinks:
  basemap: basemap_download.merged_basemap
  segmentation_mask: basemap_segmentation.segmentation_mask
parameters:
  bingmaps_api_key: null
  basemap_zoom_level: 14
  model_type: vit_b
  spatial_overlap: 0.5
tasks:
  basemap_download:
    workflow: data_ingestion/bing/basemap_download_merge
    parameters:
      api_key: '@from(bingmaps_api_key)'
      zoom_level: '@from(basemap_zoom_level)'
  basemap_segmentation:
    workflow: ml/segment_anything/prompt_segmentation
    parameters:
      model_type: '@from(model_type)'
      band_names:
      - red
      - green
      - blue
      band_scaling: null
      band_offset: null
      spatial_overlap: '@from(spatial_overlap)'
edges:
- origin: basemap_download.merged_basemap
  destination:
  - basemap_segmentation.input_raster
description:
  short_description: Baixa o mapa base com a API do BingMaps e executa o Segment Anything Model (SAM) sobre ele com pontos e/ou caixas delimitadoras como prompts.
  long_description: O fluxo de trabalho lista e baixa as peças do mapa base com a API do BingMaps e as mescla em um único raster. O raster é então dividido em fragmentos de 1024x1024 pixels com uma sobreposição definida por `spatial_overlap`. Os fragmentos que intersectam com os prompts são processados pelo codificador de imagem do SAM, seguido pelo codificador de prompt e decodificador de máscara. Antes de executar o fluxo de trabalho, certifique-se de que o modelo foi importado para o cluster executando `scripts/export_prompt_segmentation_models.py`. O script baixará os pesos do modelo desejado do repositório do SAM, exportará o codificador de imagem e o decodificador de máscara para o formato ONNX e os adicionará ao cluster. Para mais informações, consulte a página de [solução de problemas do FarmVibes.AI](https://microsoft.github.io/farmvibes-ai/docfiles/markdown/TROUBLESHOOTING.html) na documentação.
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
    prompts: Referências externas para os prompts de ponto e/ou caixa delimitadora. Estes são GeoJSON com coordenadas, rótulo (primeiro plano/plano de fundo) e id do prompt (caso o raster contenha múltiplas entidades que devam ser segmentadas em uma única execução do fluxo de trabalho).
  sinks:
    basemap: Mapa base mesclado usado como entrada para a segmentação.
    segmentation_mask: Máscaras de segmentação de saída.


```