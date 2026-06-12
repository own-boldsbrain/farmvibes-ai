# data_ingestion/glad/glad_forest_extent_download_merge

Baixa os blocos (tiles) dos dados florestais do Global Land Analysis (GLAD) que interceptam a geometria e o intervalo de tempo informados pelo usuário, e os mescla em um único raster. O fluxo de trabalho lista os produtos florestais GLAD que interceptam a geometria e o intervalo de tempo de entrada, e baixa os produtos filtrados. Os produtos baixados são mesclados em um único raster e classificados. Os blocos resultantes possuem valores de pixel categorizados em duas classes: 0 (não floresta) e 1 (floresta). Este fluxo de trabalho utiliza a mesma definição de floresta da Organização das Nações Unidas para a Alimentação e a Agricultura (FAO).

```{mermaid}
    graph TD
    inp1>input_item]
    out1>merged_product]
    out2>categorical_raster]
    tsk1{{glad_forest_extent_download}}
    tsk2{{group_rasters_by_time}}
    tsk3{{merge}}
    tsk1{{glad_forest_extent_download}} -- downloaded_product/rasters --> tsk2{{group_rasters_by_time}}
    tsk2{{group_rasters_by_time}} -- raster_groups/raster_sequence --> tsk3{{merge}}
    inp1>input_item] -- input_item --> tsk1{{glad_forest_extent_download}}
    tsk3{{merge}} -- raster --> out1>merged_product]
    tsk1{{glad_forest_extent_download}} -- downloaded_product --> out2>categorical_raster]
```

## Fontes (Sources)

- **input_item**: Geometria de interesse para a qual baixar os dados de extensão florestal GLAD.

## Sinks

- **merged_product**: Produto de extensão florestal GLAD mesclado para a geometria de interesse.

- **categorical_raster**: Raster com os dados de extensão florestal GLAD.

## Tarefas (Tasks)

- **glad_forest_extent_download**: Baixa os dados de extensão florestal do Global Land Analysis (GLAD).

- **group_rasters_by_time**: Esta operação agrupa rasters no tempo de acordo com o 'critério' (criterion).

- **merge**: Mescla rasters em uma sequência para um único raster.

## Workflow Yaml

```yaml

name: glad_forest_extent_download_merge
sources:
  input_item:
  - glad_forest_extent_download.input_item
parameters: null
sinks:
  merged_product: merge.raster
  categorical_raster: glad_forest_extent_download.downloaded_product
tasks:
  glad_forest_extent_download:
    workflow: data_ingestion/glad/glad_forest_extent_download
  group_rasters_by_time:
    op: group_rasters_by_time
    parameters:
      criterion: year
  merge:
    op: merge_rasters
edges:
- origin: glad_forest_extent_download.downloaded_product
  destination:
  - group_rasters_by_time.rasters
- origin: group_rasters_by_time.raster_groups
  destination:
  - merge.raster_sequence
description:
  short_description: Baixa os blocos dos dados florestais do Global Land Analysis (GLAD) que interceptam a geometria e o intervalo de tempo informados pelo usuário, e os mescla em um único raster.
  long_description: O fluxo de trabalho lista os produtos florestais GLAD que interceptam
    a geometria e o intervalo de tempo de entrada, e baixa os produtos filtrados. Os produtos
    baixados são mesclados em um único raster e classificados. Os blocos resultantes possuem
    valores de pixel categorizados em duas classes: 0 (não floresta) e 1 (floresta). Este
    fluxo de trabalho utiliza a mesma definição de floresta da Organização das Nações Unidas
    para a Alimentação e a Agricultura (FAO).
  sources:
    input_item: Geometria de interesse para a qual baixar os dados de extensão florestal GLAD.
  sinks:
    merged_product: Produto de extensão florestal GLAD mesclado para a geometria de interesse.
    categorical_raster: Raster com os dados de extensão florestal GLAD.


```
