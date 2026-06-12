# farm_ai/segmentation/segment_s2

Baixa imagens do Sentinel-2 e executa o Segment Anything Model (SAM) sobre elas com pontos e/ou caixas delimitadoras (bounding boxes) como prompts. O fluxo de trabalho (workflow) recupera os produtos Sentinel-2 relevantes com a API do Planetary Computer (PC) e divide os rasters de entrada em fragmentos (chips) de 1024x1024 pixels com uma sobreposição definida por `spatial_overlap`. Os fragmentos que intersectam com os prompts são processados pelo codificador de imagem (image encoder) do SAM, seguido pelo codificador de prompt (prompt encoder) e decodificador de máscara (mask decoder). Antes de executar o fluxo de trabalho, certifique-se de que o modelo foi importado para o cluster executando `scripts/export_prompt_segmentation_models.py`. O script baixará os pesos do modelo desejado do repositório do SAM, exportará o codificador de imagem e o decodificador de máscara para o formato ONNX e os adicionará ao cluster. Para mais informações, consulte a página de [solução de problemas do FarmVibes.AI](https://microsoft.github.io/farmvibes-ai/docfiles/markdown/TROUBLESHOOTING.html) na documentação.

```{mermaid}
    graph TD
    inp1>user_input]
    inp2>prompts]
    out1>s2_raster]
    out2>segmentation_mask]
    tsk1{{preprocess_s2}}
    tsk2{{s2_segmentation}}
    tsk1{{preprocess_s2}} -- raster/input_raster --> tsk2{{s2_segmentation}}
    inp1>user_input] -- user_input --> tsk1{{preprocess_s2}}
    inp1>user_input] -- input_geometry --> tsk2{{s2_segmentation}}
    inp2>prompts] -- input_prompts --> tsk2{{s2_segmentation}}
    tsk1{{preprocess_s2}} -- raster --> out1>s2_raster]
    tsk2{{s2_segmentation}} -- segmentation_mask --> out2>segmentation_mask]
```

## Fontes (Sources)

- **user_input**: Intervalo de tempo e geometria de interesse.

- **prompts**: Referências externas (ExternalReferences) para os prompts de ponto e/ou caixa delimitadora. Estes são GeoJSON com coordenadas, rótulo (primeiro plano/plano de fundo) e id do prompt (caso o raster contenha múltiplas entidades que devam ser segmentadas em uma única execução do fluxo de trabalho).

## Sinks (Saídas)

- **s2_raster**: Rasters Sentinel-2 usados como entrada para a segmentação.

- **segmentation_mask**: Máscaras de segmentação de saída.

## Parâmetros

- **model_type**: Arquitetura da espinha dorsal (backbone) do codificador de imagem do SAM, entre 'vit_h', 'vit_l' ou 'vit_b'. Antes de executar o fluxo de trabalho, certifique-se de que o modelo desejado foi exportado para o cluster executando `scripts/export_sam_models.py`. Para mais informações, consulte a página de solução de problemas do FarmVibes.AI na documentação.

- **spatial_overlap**: Porcentagem de sobreposição espacial entre fragmentos no intervalo de [0.0, 1.0).

- **pc_key**: Chave de API opcional do Planetary Computer.

## Tarefas (Tasks)

- **preprocess_s2**: Baixa e pré-processa imagens do Sentinel-2 que cobrem a geometria e o intervalo de tempo de entrada.

- **s2_segmentation**: Executa o Segment Anything Model (SAM) sobre rasters de entrada com pontos e/ou caixas delimitadoras como prompts.

## Workflow Yaml

```yaml

name: segment_s2
sources:
  user_input:
  - preprocess_s2.user_input
  - s2_segmentation.input_geometry
  prompts:
  - s2_segmentation.input_prompts
sinks:
  s2_raster: preprocess_s2.raster
  segmentation_mask: s2_segmentation.segmentation_mask
parameters:
  model_type: vit_b
  spatial_overlap: 0.5
  pc_key: null
tasks:
  preprocess_s2:
    workflow: data_ingestion/sentinel2/preprocess_s2
    parameters:
      pc_key: '@from(pc_key)'
  s2_segmentation:
    workflow: ml/segment_anything/prompt_segmentation
    parameters:
      model_type: '@from(model_type)'
      band_names:
      - R
      - G
      - B
      band_scaling: null
      band_offset: null
      spatial_overlap: '@from(spatial_overlap)'
edges:
- origin: preprocess_s2.raster
  destination:
  - s2_segmentation.input_raster
description:
  short_description: Baixa imagens do Sentinel-2 e executa o Segment Anything Model (SAM) sobre elas com pontos e/ou caixas delimitadoras como prompts.
  long_description: O fluxo de trabalho recupera os produtos Sentinel-2 relevantes com a API do Planetary Computer (PC) e divide os rasters de entrada em fragmentos de 1024x1024 pixels com uma sobreposição definida por `spatial_overlap`. Os fragmentos que intersectam com os prompts são processados pelo codificador de imagem do SAM, seguido pelo codificador de prompt e decodificador de máscara. Antes de executar o fluxo de trabalho, certifique-se de que o modelo foi importado para o cluster executando `scripts/export_prompt_segmentation_models.py`. O script baixará os pesos do modelo desejado do repositório do SAM, exportará o codificador de imagem e o decodificador de máscara para o formato ONNX e os adicionará ao cluster. Para mais informações, consulte a página de [solução de problemas do FarmVibes.AI](https://microsoft.github.io/farmvibes-ai/docfiles/markdown/TROUBLESHOOTING.html) na documentação.
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
    prompts: Referências externas para os prompts de ponto e/ou caixa delimitadora. Estes são GeoJSON com coordenadas, rótulo (primeiro plano/plano de fundo) e id do prompt (caso o raster contenha múltiplas entidades que devam ser segmentadas em uma única execução do fluxo de trabalho).
  sinks:
    s2_raster: Rasters Sentinel-2 usados como entrada para a segmentação.
    segmentation_mask: Máscaras de segmentação de saída.


```