# ml/segment_anything/prompt_segmentation

Executa o Segment Anything Model (SAM) sobre rasters de entrada com pontos e/ou caixas delimitadoras (bounding boxes) como prompts. O fluxo de trabalho (workflow) divide os rasters de entrada em fragmentos (chips) de 1024x1024 pixels com uma sobreposição definida por `spatial_overlap`. Os fragmentos que intersectam com os prompts são processados pelo codificador de imagem (image encoder) do SAM, seguido pelo codificador de prompt (prompt encoder) e decodificador de máscara (mask decoder). Antes de executar o fluxo de trabalho, certifique-se de que o modelo foi importado para o cluster executando `scripts/export_prompt_segmentation_models.py`. O script baixará os pesos do modelo desejado do repositório do SAM, exportará o codificador de imagem e o decodificador de máscara para o formato ONNX e os adicionará ao cluster. Para mais informações, consulte a página de [solução de problemas do FarmVibes.AI](https://microsoft.github.io/farmvibes-ai/docfiles/markdown/TROUBLESHOOTING.html) na documentação.

```{mermaid}
    graph TD
    inp1>input_raster]
    inp2>input_geometry]
    inp3>input_prompts]
    out1>segmentation_mask]
    tsk1{{ingest_points}}
    tsk2{{clip}}
    tsk3{{sam_inference}}
    tsk1{{ingest_points}} -- geometry/input_prompts --> tsk3{{sam_inference}}
    tsk2{{clip}} -- clipped_raster/input_raster --> tsk3{{sam_inference}}
    inp1>input_raster] -- raster --> tsk2{{clip}}
    inp2>input_geometry] -- input_geometry --> tsk2{{clip}}
    inp3>input_prompts] -- user_input --> tsk1{{ingest_points}}
    tsk3{{sam_inference}} -- segmentation_mask --> out1>segmentation_mask]
```

## Fontes (Sources)

- **input_geometry**: Geometria de interesse dentro do raster para a segmentação.

- **input_raster**: Rasters usados como entrada para a segmentação.

- **input_prompts**: Referências externas (ExternalReferences) para os prompts de ponto e/ou caixa delimitadora. Estes são GeoJSON com coordenadas, rótulo (primeiro plano/plano de fundo) e id do prompt (caso o raster contenha múltiplas entidades que devam ser segmentadas em uma única execução do fluxo de trabalho).

## Sinks (Saídas)

- **segmentation_mask**: Máscaras de segmentação de saída.

## Parâmetros

- **model_type**: Arquitetura da espinha dorsal (backbone) do codificador de imagem do SAM, entre 'vit_h', 'vit_l' ou 'vit_b'. Antes de executar o fluxo de trabalho, certifique-se de que o modelo desejado foi exportado para o cluster executando `scripts/export_sam_models.py`. Para mais informações, consulte a página de solução de problemas do FarmVibes.AI na documentação.

- **band_names**: Nome das bandas de raster que devem ser selecionadas para compor as imagens de 3 canais esperadas pelo SAM. Se não for fornecido, tentará usar ["R", "G", "B"]. Se apenas um único nome de banda for fornecido, ele será replicado em todos os três canais.

- **band_scaling**: Uma lista de números decimais (floats) para dimensionar cada banda para o intervalo de [0.0, 1.0] ou [0.0, 255.0]. Se não for fornecido, o padrão será o parâmetro de dimensionamento do raster. Se uma lista com um único valor for fornecida, ela será usada para as três bandas.

- **band_offset**: Uma lista de números decimais para compensar (offset) cada banda. Se não for fornecido, o padrão será o valor de compensação do raster. Se uma lista com um único valor for fornecida, ela será usada para as três bandas.

- **spatial_overlap**: Porcentagem de sobreposição espacial entre fragmentos no intervalo de [0.0, 1.0).

## Tarefas (Tasks)

- **ingest_points**: Adiciona geometrias de usuário ao armazenamento do cluster, permitindo que sejam usadas em fluxos de trabalho.

- **clip**: Realiza um recorte (clip) em um raster de entrada com base em uma geometria de referência fornecida.

- **sam_inference**: Executa o SAM sobre o raster de entrada com pontos e caixas delimitadoras como prompts.

## Workflow Yaml

```yaml

name: prompt_segmentation
sources:
  input_raster:
  - clip.raster
  input_geometry:
  - clip.input_geometry
  input_prompts:
  - ingest_points.user_input
sinks:
  segmentation_mask: sam_inference.segmentation_mask
parameters:
  model_type: vit_b
  band_names: null
  band_scaling: null
  band_offset: null
  spatial_overlap: 0.5
tasks:
  ingest_points:
    workflow: data_ingestion/user_data/ingest_geometry
  clip:
    workflow: data_processing/clip/clip
  sam_inference:
    op: prompt_segmentation
    op_dir: segment_anything
    parameters:
      model_type: '@from(model_type)'
      band_names: '@from(band_names)'
      band_scaling: '@from(band_scaling)'
      band_offset: '@from(band_offset)'
      spatial_overlap: '@from(spatial_overlap)'
edges:
- origin: ingest_points.geometry
  destination:
  - sam_inference.input_prompts
- origin: clip.clipped_raster
  destination:
  - sam_inference.input_raster
description:
  short_description: Executa o Segment Anything Model (SAM) sobre rasters de entrada com pontos e/ou caixas delimitadoras como prompts.
  long_description: O fluxo de trabalho divide os rasters de entrada em fragmentos de 1024x1024 pixels com uma sobreposição definida por `spatial_overlap`. Os fragmentos que intersectam com os prompts são processados pelo codificador de imagem do SAM, seguido pelo codificador de prompt e decodificador de máscara. Antes de executar o fluxo de trabalho, certifique-se de que o modelo foi importado para o cluster executando `scripts/export_prompt_segmentation_models.py`. O script baixará os pesos do modelo desejado do repositório do SAM, exportará o codificador de imagem e o decodificador de máscara para o formato ONNX e os adicionará ao cluster. Para mais informações, consulte a página de [solução de problemas do FarmVibes.AI](https://microsoft.github.io/farmvibes-ai/docfiles/markdown/TROUBLESHOOTING.html) na documentação.
  sources:
    input_geometry: Geometria de interesse dentro do raster para a segmentação.
    input_raster: Rasters usados como entrada para a segmentação.
    input_prompts: Referências externas para os prompts de ponto e/ou caixa delimitadora. Estes são GeoJSON com coordenadas, rótulo (primeiro plano/plano de fundo) e id do prompt (caso o raster contenha múltiplas entidades que devam ser segmentadas em uma única execução do fluxo de trabalho).
  sinks:
    segmentation_mask: Máscaras de segmentação de saída.


```