# ml/crop_segmentation

Executa um modelo de segmentação de culturas baseado em NDVI a partir de imagens SpaceEye ao longo do ano. O fluxo de trabalho (workflow) gera dados livres de nuvens do SpaceEye para a região e o intervalo de tempo de entrada e calcula o NDVI sobre eles. Os valores de NDVI amostrados regularmente ao longo do ano são empilhados como bandas e usados como entrada para o modelo de segmentação de culturas.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>segmentation]
    tsk1{{spaceeye}}
    tsk2{{ndvi}}
    tsk3{{group}}
    tsk4{{inference}}
    tsk1{{spaceeye}} -- raster --> tsk2{{ndvi}}
    tsk2{{ndvi}} -- index_raster/rasters --> tsk3{{group}}
    tsk3{{group}} -- sequence/input_raster --> tsk4{{inference}}
    inp1>user_input] -- user_input --> tsk1{{spaceeye}}
    tsk4{{inference}} -- output_raster --> out1>segmentation]
```

## Fontes (Sources)

- **user_input**: Intervalo de tempo e geometria de interesse.

## Sinks (Saídas)

- **segmentation**: Mapa de segmentação de culturas com resolução de 10m.

## Parâmetros

- **pc_key**: Chave de API opcional do Planetary Computer.

- **model_file**: Caminho para o arquivo ONNX contendo a arquitetura e os pesos do modelo.

- **model_bands**: Número de bandas NDVI para empilhar como entrada do modelo.

## Tarefas (Tasks)

- **spaceeye**: Executa o pipeline de remoção de nuvens SpaceEye usando um algoritmo baseado em interpolação, produzindo imagens diárias livres de nuvens para a geometria e o intervalo de tempo de entrada.

- **ndvi**: Calcula um índice a partir das bandas de um raster de entrada.

- **group**: Seleciona "num" entradas de uma lista de Rasters para que a sequência de saída tenha um comprimento fixo.

- **inference**: Processa uma sequência de rasters com um modelo ONNX.

## Workflow Yaml

```yaml

name: crop_segmentation
sources:
  user_input:
  - spaceeye.user_input
sinks:
  segmentation: inference.output_raster
parameters:
  pc_key: null
  model_file: null
  model_bands: 37
tasks:
  spaceeye:
    workflow: data_ingestion/spaceeye/spaceeye_interpolation
    parameters:
      pc_key: '@from(pc_key)'
  ndvi:
    workflow: data_processing/index/index
    parameters:
      index: ndvi
  group:
    op: select_sequence_from_list
    op_dir: select_sequence
    parameters:
      num: '@from(model_bands)'
      criterion: regular
  inference:
    op: compute_onnx_from_sequence
    op_dir: compute_onnx
    parameters:
      model_file: '@from(model_file)'
      window_size: 256
      overlap: 0.25
      num_workers: 4
edges:
- origin: spaceeye.raster
  destination:
  - ndvi.raster
- origin: ndvi.index_raster
  destination:
  - group.rasters
- origin: group.sequence
  destination:
  - inference.input_raster
description:
  short_description: Executa um modelo de segmentação de culturas baseado em NDVI a partir de imagens SpaceEye ao longo do ano.
  long_description: O fluxo de trabalho gera dados livres de nuvens do SpaceEye para a região e o intervalo de tempo de entrada e calcula o NDVI sobre eles. Os valores de NDVI amostrados regularmente ao longo do ano são empilhados como bandas e usados como entrada para o modelo de segmentação de culturas.
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    segmentation: Mapa de segmentação de culturas com resolução de 10m.
  parameters:
    pc_key: Chave de API opcional do Planetary Computer.
    model_file: Caminho para o arquivo ONNX contendo a arquitetura e os pesos do modelo.
    model_bands: Número de bandas NDVI para empilhar como entrada do modelo.


```