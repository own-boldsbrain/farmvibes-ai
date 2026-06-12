# ml/dataset_generation/datagen_crop_segmentation

Gera um conjunto de dados (dataset) para segmentação de culturas, baseado no raster NDVI e nos mapas da Camada de Dados de Culturas (CDL - Crop Data Layer). O fluxo de trabalho (workflow) gera dados livres de nuvens do SpaceEye para a região e o intervalo de tempo de entrada e calcula o NDVI sobre eles. Também baixa mapas CDL para os anos incluídos no intervalo de tempo.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>ndvi]
    out2>cdl]
    tsk1{{spaceeye}}
    tsk2{{ndvi}}
    tsk3{{cdl}}
    tsk1{{spaceeye}} -- raster --> tsk2{{ndvi}}
    inp1>user_input] -- user_input --> tsk1{{spaceeye}}
    inp1>user_input] -- user_input --> tsk3{{cdl}}
    tsk2{{ndvi}} -- index_raster --> out1>ndvi]
    tsk3{{cdl}} -- raster --> out2>cdl]
```

## Fontes (Sources)

- **user_input**: Intervalo de tempo e geometria de interesse.

## Sinks (Saídas)

- **ndvi**: Rasters NDVI.

- **cdl**: Mapa CDL para os anos incluídos no intervalo de tempo de entrada.

## Parâmetros

- **pc_key**: Chave de API opcional do Planetary Computer.

## Tarefas (Tasks)

- **spaceeye**: Executa o pipeline de remoção de nuvens SpaceEye usando um algoritmo baseado em interpolação, produzindo imagens diárias livres de nuvens para a geometria e o intervalo de tempo de entrada.

- **ndvi**: Calcula um índice a partir das bandas de um raster de entrada.

- **cdl**: Baixa mapas de classes de culturas nos EUA continentais para o intervalo de tempo de entrada.

## Workflow Yaml

```yaml

name: datagen_crop_segmentation
sources:
  user_input:
  - spaceeye.user_input
  - cdl.user_input
sinks:
  ndvi: ndvi.index_raster
  cdl: cdl.raster
parameters:
  pc_key: null
tasks:
  spaceeye:
    workflow: data_ingestion/spaceeye/spaceeye_interpolation
    parameters:
      pc_key: '@from(pc_key)'
  ndvi:
    workflow: data_processing/index/index
    parameters:
      index: ndvi
  cdl:
    workflow: data_ingestion/cdl/download_cdl
edges:
- origin: spaceeye.raster
  destination:
  - ndvi.raster
description:
  short_description: Gera um conjunto de dados para segmentação de culturas, baseado no raster NDVI e nos mapas da Camada de Dados de Culturas (CDL).
  long_description: O fluxo de trabalho gera dados livres de nuvens do SpaceEye para a região e o intervalo de tempo de entrada e calcula o NDVI sobre eles. Também baixa mapas CDL para os anos incluídos no intervalo de tempo.
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    ndvi: Rasters NDVI.
    cdl: Mapa CDL para os anos incluídos no intervalo de tempo de entrada.
  parameters:
    pc_key: Chave de API opcional do Planetary Computer.


```